import prisma from '../../db/prisma';
import { getProjectWithAccess } from '../projects/projects.service';

export const createWidgetConfig = async (projectId: string, ownerId: string, config: any) => {
  await getProjectWithAccess(projectId, ownerId);

  return await prisma.projectWidgetConfig.create({
    data: {
      projectId,
      config,
    },
  });
};
