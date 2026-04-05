import { Request, Response } from 'express';
import * as chatService from './chat.service';
import prisma from '../../db/prisma';
import { AuthRequest } from '../../types/auth.types';

export const createMessage = async (req: Request, res: Response) => {
  const { projectId, message, sessionToken } = req.body;
  const result = await chatService.createMessage(projectId, message, sessionToken);
  res.json(result);
};

export const submitLead = async (req: Request, res: Response) => {
  const { projectId, sessionToken, name, email } = req.body;
  const result = await chatService.submitLead(projectId, sessionToken, name, email);
  res.json(result);
};

export const getLeadsHandler = async (req: AuthRequest, res: Response) => {
  const { projectId, status } = req.query;
  const ownerId = req.user?.ownerId;

  if (!ownerId) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  if (!projectId) {
    return res.status(400).json({ error: 'projectId_required' });
  }

  const result = await chatService.getLeads(projectId as string, ownerId, status as string);
  res.json(result);
};

export const getLeadByIdHandler = async (req: AuthRequest, res: Response) => {
  const { leadId } = req.params;
  const ownerId = req.user?.ownerId;

  if (!ownerId) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const lead = await chatService.getLeadById(leadId, ownerId);

  if (!lead) {
    return res.status(404).json({ error: 'lead_not_found' });
  }

  return res.json(lead);
};

export const updateLeadStatusHandler = async (req: AuthRequest, res: Response) => {
  const { leadId } = req.params;
  const { status } = req.body;
  const ownerId = req.user?.ownerId;

  if (!ownerId) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  try {
    const result = await chatService.updateLeadStatus(leadId, status, ownerId);
    res.json(result);
  } catch (error) {
    return res.status(404).json({ error: 'lead_not_found' });
  }
};
