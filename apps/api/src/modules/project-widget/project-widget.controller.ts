import { Response } from 'express';
import * as projectWidgetService from './project-widget.service';
import { AuthRequest } from '../../types/auth.types';

export const createWidgetConfig = async (req: AuthRequest, res: Response) => {
  const { projectId, config } = req.body;
  const ownerId = req.user?.ownerId;

  if (!ownerId) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  try {
    const result = await projectWidgetService.createWidgetConfig(projectId, ownerId, config);
    res.json(result);
  } catch (error: any) {
    if (error.message === 'subscription_inactive') {
      return res.status(403).json({ error: 'subscription_inactive' });
    }
    return res.status(404).json({ error: 'project_not_found' });
  }
};
