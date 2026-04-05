import { Router } from 'express';
import * as projectWidgetController from './project-widget.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { subscriptionGate } from '../../middleware/subscription.middleware';

const router = Router();

router.post('/', authMiddleware, subscriptionGate, projectWidgetController.createWidgetConfig);

export default router;
