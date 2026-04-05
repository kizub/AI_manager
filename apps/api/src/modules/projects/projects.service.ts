import prisma from '../../db/prisma';

export const createProject = async (name: string, ownerId: string) => {
  return await prisma.project.create({
    data: {
      name,
      ownerId,
    },
  });
};

export const getProjects = async (ownerId: string) => {
  return await prisma.project.findMany({
    where: { ownerId },
  });
};

export const getProjectById = async (id: string, ownerId: string) => {
  return await prisma.project.findFirst({
    where: { id, ownerId },
  });
};

export const getProjectWithAccess = async (id: string, ownerId: string) => {
  const project = await (prisma.project as any).findFirst({
    where: { id, ownerId },
  });

  if (!project) {
    throw new Error('project_not_found');
  }

  if (project.subscriptionStatus !== 'active') {
    throw new Error('subscription_inactive');
  }

  return project;
};

export const updateProject = async (id: string, ownerId: string, data: any) => {
  const result = await prisma.project.updateMany({
    where: { id, ownerId },
    data,
  });

  if (result.count === 0) {
    throw new Error('project_not_found');
  }

  return await prisma.project.findUnique({
    where: { id },
  });
};
