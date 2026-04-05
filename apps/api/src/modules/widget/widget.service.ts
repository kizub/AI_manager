import prisma from '../../db/prisma';

export const initWidget = async (projectId: string) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      aiConfig: true,
      widgetConfig: true,
      subscription: true,
    },
  });

  if (!project) {
    return { widgetEnabled: false };
  }

  const subscription = project.subscription;
  const now = new Date();

  if (!subscription || subscription.status !== 'active' || subscription.expiresAt < now) {
    return { widgetEnabled: false };
  }

  return {
    widgetEnabled: true,
    project: {
      id: project.id,
      name: project.name,
    },
    ai: {
      model: project.aiConfig?.model,
      prompt: project.aiConfig?.prompt,
    },
    widget: typeof project.widgetConfig?.config === 'string' 
      ? JSON.parse(project.widgetConfig.config) 
      : project.widgetConfig?.config,
  };
};
