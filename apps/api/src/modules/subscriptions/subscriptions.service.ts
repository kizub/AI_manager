import prisma from '../../db/prisma';

export const createSubscription = async (projectId: string, plan: string, status: string, expiresAt: string) => {
  return await prisma.subscription.create({
    data: {
      projectId,
      plan,
      status,
      expiresAt: new Date(expiresAt),
    },
  });
};
