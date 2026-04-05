import { Response } from 'express';
import * as projectsService from './projects.service';
import { AuthRequest } from '../../types/auth.types';

export const createProject = async (req: AuthRequest, res: Response) => {
  const { name } = req.body;
  const ownerId = req.user?.ownerId;

  if (!ownerId) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const project = await projectsService.createProject(name, ownerId);
  res.json(project);
};

export const getProjects = async (req: AuthRequest, res: Response) => {
  const ownerId = req.user?.ownerId;

  if (!ownerId) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const projects = await projectsService.getProjects(ownerId);
  res.json(projects);
};

export const getProjectById = async (req: AuthRequest, res: Response) => {
  const { projectId } = req.params;
  const ownerId = req.user?.ownerId;

  if (!ownerId) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const project = await projectsService.getProjectById(projectId, ownerId);

  if (!project) {
    return res.status(404).json({ error: 'project_not_found' });
  }

  res.json(project);
};

export const updateProject = async (req: AuthRequest, res: Response) => {
  const { projectId } = req.params;
  const { name } = req.body;
  const ownerId = req.user?.ownerId;

  if (!ownerId) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  try {
    const project = await projectsService.updateProject(projectId, ownerId, { name });
    res.json(project);
  } catch (error) {
    return res.status(404).json({ error: 'project_not_found' });
  }
};
