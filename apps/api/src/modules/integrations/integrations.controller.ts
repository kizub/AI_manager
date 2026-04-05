import { Response } from 'express';
import * as integrationsService from './integrations.service';
import { AuthRequest } from '../../types/auth.types';

export const createIntegration = async (req: AuthRequest, res: Response) => {
  const { projectId, provider, config } = req.body;
  const ownerId = req.user?.ownerId;

  if (!ownerId) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  try {
    const result = await integrationsService.createIntegration(projectId, ownerId, provider, config);
    res.json(result);
  } catch (error: any) {
    if (error.message === 'subscription_inactive') {
      return res.status(403).json({ error: 'subscription_inactive' });
    }
    return res.status(404).json({ error: 'project_not_found' });
  }
};
