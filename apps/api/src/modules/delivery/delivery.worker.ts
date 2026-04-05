import { Worker } from 'bullmq';
import prisma from '../../db/prisma';
import { sendTelegramNotification } from './telegram.sender';

export const deliveryWorker = process.env.REDIS_URL
  ? new Worker(
      'deliveryQueue',
      async (job) => {
        if (job.name === 'sendTelegramLead') {
          console.log('[DeliveryWorker] Start job', {
            jobId: job.id,
            name: job.name,
            attemptsMade: job.attemptsMade,
          });
          const { projectId, sessionId, leadId } = job.data;

          const processJob = async () => {
            if (!projectId || !sessionId || !leadId) {
              return { status: 'failed', reason: 'missing_required_fields' };
            }

            const lead = await prisma.lead.findUnique({
              where: { id: leadId },
            });

            if (!lead) {
              return { status: 'failed', reason: 'lead_not_found', leadId, projectId, sessionId };
            }

            const integration = await prisma.projectIntegration.findFirst({
              where: {
                projectId,
                provider: 'telegram',
              },
            });

            if (!integration) {
              const reason = 'telegram_integration_not_found';
              console.log('[DeliveryWorker] Skipped', {
                jobId: job.id,
                reason,
              });
              return { status: 'skipped', reason, leadId, projectId, sessionId };
            }

            const project = await prisma.project.findUnique({
              where: { id: projectId },
            });

            if (!project) {
              return { status: 'failed', reason: 'project_not_found', leadId, projectId, sessionId };
            }

            const botToken = (integration?.config as any)?.botToken || process.env.TELEGRAM_BOT_TOKEN;
            const chatId = (integration?.config as any)?.chatId || process.env.TELEGRAM_CHAT_ID;

            if (botToken && chatId) {
              const messageText = `Новий lead (Async)\nProject: ${project.name}\nSession: ${sessionId}\nName: ${lead.name || '-'}\nEmail: ${lead.email || '-'}`;

              const log = await prisma.deliveryLog.create({
                data: {
                  leadId,
                  projectId,
                  status: 'pending',
                },
              });

              try {
                const response = await sendTelegramNotification(botToken, chatId, messageText);
                
                if (response.ok) {
                  await prisma.deliveryLog.update({
                    where: { id: log.id },
                    data: { status: 'sent' },
                  });
                } else {
                  const errorData = await response.json().catch(() => ({}));
                  await prisma.deliveryLog.update({
                    where: { id: log.id },
                    data: { 
                      status: 'failed',
                      error: JSON.stringify(errorData) || 'telegram_error'
                    },
                  });
                  return { status: 'failed', reason: 'telegram_request_failed', leadId, projectId, sessionId };
                }
              } catch (err: any) {
                await prisma.deliveryLog.update({
                  where: { id: log.id },
                  data: { 
                    status: 'failed',
                    error: err.message || 'unknown_error'
                  },
                });
                return { status: 'failed', reason: 'telegram_request_failed', leadId, projectId, sessionId };
              }

              console.log('[DeliveryWorker] Delivered', {
                jobId: job.id,
                leadId,
                projectId,
              });
              return { status: 'delivered', leadId, projectId, sessionId };
            }

            return { status: 'failed', reason: 'telegram_credentials_missing', leadId, projectId, sessionId };
          };

          const result = await processJob();

          if (result.status === 'failed') {
            console.log('[DeliveryWorker] Failed', {
              jobId: job.id,
              reason: result.reason,
              attemptsMade: job.attemptsMade,
            });
            if (job.attemptsMade < 2) {
              throw new Error(`Delivery failed: ${result.reason}. Attempt ${job.attemptsMade + 1}/3`);
            }
            return { 
              status: 'failed_final', 
              reason: 'max_attempts_reached', 
              originalReason: result.reason,
              leadId, 
              projectId, 
              sessionId 
            };
          }

          return result;
        }

        return true;
      },
      { connection: { url: process.env.REDIS_URL } }
    )
  : null;
