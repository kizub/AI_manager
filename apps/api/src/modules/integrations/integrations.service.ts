import prisma from '../../db/prisma';
import { getProjectWithAccess } from '../projects/projects.service';

export const createIntegration = async (projectId: string, ownerId: string, provider: string, config: any) => {
  await getProjectWithAccess(projectId, ownerId);

  const integration = await prisma.projectIntegration.create({
    data: {
      projectId,
      provider,
      config,
    },
  });
  return integration;
};
