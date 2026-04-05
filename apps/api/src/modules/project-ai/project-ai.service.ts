import prisma from '../../db/prisma';
import { getProjectWithAccess } from '../projects/projects.service';

export const createAIConfig = async (projectId: string, ownerId: string, model: string, prompt: string) => {
  await getProjectWithAccess(projectId, ownerId);

  return await prisma.projectAIConfig.create({
    data: {
      projectId,
      model,
      prompt,
    },
  });
};
