import { Router } from 'express';
import * as projectsController from './projects.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

router.post('/', authMiddleware, projectsController.createProject);
router.get('/', authMiddleware, projectsController.getProjects);
router.get('/:projectId', authMiddleware, projectsController.getProjectById);
router.patch('/:projectId', authMiddleware, projectsController.updateProject);

export default router;
