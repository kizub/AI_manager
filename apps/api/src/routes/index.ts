import { Router } from 'express';
import healthRoutes from './health.routes.ts';
import projectsRoutes from '../modules/projects/projects.routes.ts';
import ownersRoutes from '../modules/owners/owners.routes.ts';
import projectAiRoutes from '../modules/project-ai/project-ai.routes.ts';
import projectWidgetRoutes from '../modules/project-widget/project-widget.routes.ts';
import subscriptionsRoutes from '../modules/subscriptions/subscriptions.routes.ts';
import widgetRoutes from '../modules/widget/widget.routes.ts';
import chatRoutes from '../modules/chat/chat.routes.ts';
import integrationsRoutes from '../modules/integrations/integrations.routes.ts';
import authRoutes from '../modules/auth/auth.routes.ts';

const router = Router();

router.use('/v1', healthRoutes);
router.use('/v1/auth', authRoutes);
router.use('/v1/projects', projectsRoutes);
router.use('/v1/owners', ownersRoutes);
router.use('/v1/project-ai', projectAiRoutes);
router.use('/v1/project-widget', projectWidgetRoutes);
router.use('/v1/subscriptions', subscriptionsRoutes);
router.use('/v1/widget', widgetRoutes);
router.use('/v1/chat', chatRoutes);
router.use('/v1/integrations', integrationsRoutes);

export default router;
