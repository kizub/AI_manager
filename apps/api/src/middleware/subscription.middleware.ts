import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/auth.types';
import { getProjectWithAccess } from '../modules/projects/projects.service';

export const subscriptionGate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const ownerId = req.user?.ownerId;
  
  // Explicit projectId resolution
  const projectId = 
    req.params.projectId || 
    req.body.projectId || 
    req.query.projectId;

  if (!ownerId) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  if (!projectId || typeof projectId !== 'string') {
    return res.status(400).json({ error: 'projectId_required' });
  }

  try {
    await getProjectWithAccess(projectId, ownerId);
    next();
  } catch (error: any) {
    if (error.message === 'project_not_found') {
      return res.status(404).json({ error: 'project_not_found' });
    }
    if (error.message === 'subscription_inactive') {
      return res.status(403).json({ error: 'subscription_inactive' });
    }
    return res.status(500).json({ error: 'internal_server_error' });
  }
};
