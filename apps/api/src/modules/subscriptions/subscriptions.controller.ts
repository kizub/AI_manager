import { Request, Response } from 'express';
import * as subscriptionsService from './subscriptions.service';

export const createSubscription = async (req: Request, res: Response) => {
  const { projectId, plan, status, expiresAt } = req.body;
  const result = await subscriptionsService.createSubscription(projectId, plan, status, expiresAt);
  res.json(result);
};
