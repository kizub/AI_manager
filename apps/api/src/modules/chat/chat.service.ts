import prisma from '../../db/prisma';
import { deliveryQueue } from '../delivery/delivery.queue';
import { sendTelegramNotification } from '../delivery/telegram.sender';

export const createMessage = async (projectId: string, message: string, sessionToken?: string) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { aiConfig: true },
  });

  if (!project) {
    return { error: 'project not found' };
  }

  let session;

  if (sessionToken) {
    session = await prisma.chatSession.findFirst({
      where: {
        id: sessionToken,
        projectId,
      },
    });
  }

  if (!session) {
    session = await prisma.chatSession.create({
      data: {
        projectId,
      },
    });
  }

  const userMessage = await prisma.chatMessage.create({
    data: {
      projectId,
      sessionId: session.id,
      role: 'user',
      content: message,
    },
  });

  const history = await prisma.chatMessage.findMany({
    where: { sessionId: session.id },
    orderBy: { createdAt: 'asc' },
  });

  if (!project.aiConfig) {
    return {
      sessionId: session.id,
      userMessage,
      assistantMessage: null,
    };
  }

  const { GoogleGenAI } = await import('@google/genai');
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

  const systemInstruction = `${project.aiConfig.prompt}\n\nAI має повертати тільки JSON у форматі:\n{\n  "reply": "string",\n  "intent": "string",\n  "lead_ready": false,\n  "show_form": false,\n  "quick_replies": [],\n  "captured_fields": {},\n  "cta": {\n    "label": "",\n    "visible": false\n  }\n}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: history.map(m => ({ 
      role: m.role === 'assistant' ? 'model' : 'user', 
      parts: [{ text: m.content }] 
    })),
    config: {
      systemInstruction,
    }
  });

  const aiText = response.text || '{}';
  const parsed = JSON.parse(aiText.replace(/```json\n?|\n?```/g, ''));

  const existingState = await prisma.sessionState.findUnique({
    where: { sessionId: session.id },
  });

  if (existingState) {
    await prisma.sessionState.update({
      where: { sessionId: session.id },
      data: { data: JSON.stringify(parsed) },
    });
  } else {
    await prisma.sessionState.create({
      data: {
        projectId,
        sessionId: session.id,
        data: JSON.stringify(parsed),
      },
    });
  }

  if (parsed.lead_ready === true) {
    const existingLead = await prisma.lead.findFirst({
      where: { sessionId: session.id },
    });

    if (!existingLead) {
      const lead = await prisma.lead.create({
        data: {
          projectId,
          sessionId: session.id,
          name: parsed.captured_fields?.name || null,
          email: parsed.captured_fields?.email || null,
          status: 'new',
        },
      });

      await prisma.leadEvent.create({
        data: {
          leadId: lead.id,
          projectId,
          type: 'lead_created',
        },
      });

      const deliveryMode = process.env.DELIVERY_MODE || 'sync';

      if (deliveryMode === 'async') {
        if (deliveryQueue) {
          await deliveryQueue.add('sendTelegramLead', {
            projectId,
            sessionId: session.id,
            leadId: lead.id,
          }, {
            attempts: 3,
            backoff: { type: 'fixed', delay: 2000 }
          });
        }
      } else {
        const integration = await prisma.projectIntegration.findFirst({
          where: {
            projectId,
            provider: 'telegram',
          },
        });

        if (integration || process.env.TELEGRAM_BOT_TOKEN) {
          const botToken = (integration?.config as any)?.botToken || process.env.TELEGRAM_BOT_TOKEN;
          const chatId = (integration?.config as any)?.chatId || process.env.TELEGRAM_CHAT_ID;

          if (botToken && chatId) {
            const messageText = `Новий lead\nProject: ${project.name}\nSession: ${session.id}\nName: ${parsed.captured_fields?.name || '-'}\nEmail: ${parsed.captured_fields?.email || '-'}\nMessage: ${parsed.reply}`;

            const log = await prisma.deliveryLog.create({
              data: {
                leadId: lead.id,
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
              }
            } catch (err: any) {
              await prisma.deliveryLog.update({
                where: { id: log.id },
                data: { 
                  status: 'failed',
                  error: err.message || 'unknown_error'
                },
              });
            }
          }
        }
      }
    }
  }

  const assistantMessage = await prisma.chatMessage.create({
    data: {
      projectId,
      sessionId: session.id,
      role: 'assistant',
      content: parsed.reply,
    },
  });

  return {
    sessionId: session.id,
    reply: parsed.reply,
    intent: parsed.intent,
    lead_ready: parsed.lead_ready,
    show_form: parsed.show_form,
    quick_replies: parsed.quick_replies,
    captured_fields: parsed.captured_fields,
    cta: parsed.cta
  };
};

export const submitLead = async (projectId: string, sessionToken: string, name: string, email: string) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    return { error: 'project not found' };
  }

  const session = await prisma.chatSession.findFirst({
    where: {
      id: sessionToken,
      projectId,
    },
  });

  if (!session) {
    return { error: 'session not found' };
  }

  const existingLead = await prisma.lead.findFirst({
    where: { sessionId: session.id },
  });

  let lead;
  if (existingLead) {
    lead = await prisma.lead.update({
      where: { id: existingLead.id },
      data: {
        name,
        email,
        status: 'submitted',
      },
    });
  } else {
    lead = await prisma.lead.create({
      data: {
        projectId,
        sessionId: session.id,
        name,
        email,
        status: 'submitted',
      },
    });
  }

  await prisma.leadEvent.create({
    data: {
      leadId: lead.id,
      projectId,
      type: 'lead_submitted',
    },
  });

  const deliveryMode = process.env.DELIVERY_MODE || 'sync';

  if (deliveryMode === 'async') {
    // Enqueue job
    if (deliveryQueue) {
      const job = await deliveryQueue.add('sendTelegramLead', {
        projectId,
        sessionId: session.id,
        leadId: lead.id,
      }, {
        attempts: 3,
        backoff: { type: 'fixed', delay: 2000 }
      });
      // jobId is available as job.id if needed
    }
  } else {
    // Telegram delivery
    const integration = await prisma.projectIntegration.findFirst({
      where: {
        projectId,
        provider: 'telegram',
      },
    });

    if (integration || process.env.TELEGRAM_BOT_TOKEN) {
      const botToken = (integration?.config as any)?.botToken || process.env.TELEGRAM_BOT_TOKEN;
      const chatId = (integration?.config as any)?.chatId || process.env.TELEGRAM_CHAT_ID;

      if (botToken && chatId) {
        const messageText = `Новий lead (Form)\nProject: ${project.name}\nSession: ${session.id}\nName: ${name}\nEmail: ${email}`;

        const log = await prisma.deliveryLog.create({
          data: {
            leadId: lead.id,
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
          }
        } catch (err: any) {
          await prisma.deliveryLog.update({
            where: { id: log.id },
            data: { 
              status: 'failed',
              error: err.message || 'unknown_error'
            },
          });
        }
      }
    }
  }

  return {
    success: true,
  };
};

export const updateLeadStatus = async (leadId: string, status: string, ownerId: string) => {
  const lead = await prisma.lead.findFirst({
    where: { 
      id: leadId,
      project: { ownerId }
    },
  });

  if (!lead) {
    throw new Error('lead_not_found');
  }

  const previousStatus = lead.status;

  const result = await prisma.lead.update({
    where: { id: leadId },
    data: { status },
  });

  await prisma.leadEvent.create({
    data: {
      leadId,
      projectId: lead.projectId,
      type: 'lead_status_changed',
      payload: JSON.stringify({ previousStatus, nextStatus: status }),
    },
  });

  return result;
};

export const getLeads = async (projectId: string, ownerId: string, status?: string) => {
  return prisma.lead.findMany({
    where: {
      projectId,
      project: { ownerId },
      ...(status ? { status } : {}),
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getLeadById = async (leadId: string, ownerId: string) => {
  return prisma.lead.findFirst({
    where: { 
      id: leadId,
      project: { ownerId }
    },
  });
};

export const getSessionMessages = async (sessionId: string, projectId: string, ownerId: string) => {
  return prisma.chatMessage.findMany({
    where: {
      sessionId,
      projectId,
      project: { ownerId }
    },
    orderBy: { createdAt: 'asc' },
  });
};

export const getLeadEvents = async (leadId: string, projectId: string, ownerId: string) => {
  return prisma.leadEvent.findMany({
    where: {
      leadId,
      projectId,
      project: { ownerId }
    },
    orderBy: { createdAt: 'asc' },
  });
};
