import { Response } from 'express';
import * as projectAiService from './project-ai.service';
import { AuthRequest } from '../../types/auth.types';

export const createAIConfig = async (req: AuthRequest, res: Response) => {
  const { projectId, model, prompt } = req.body;
  const ownerId = req.user?.ownerId;

  if (!ownerId) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  try {
    const config = await projectAiService.createAIConfig(projectId, ownerId, model, prompt);
    res.json(config);
  } catch (error: any) {
    if (error.message === 'subscription_inactive') {
      return res.status(403).json({ error: 'subscription_inactive' });
    }
    return res.status(404).json({ error: 'project_not_found' });
  }
};
