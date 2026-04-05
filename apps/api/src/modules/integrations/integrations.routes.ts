import { Router } from 'express';
import * as integrationsController from './integrations.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { subscriptionGate } from '../../middleware/subscription.middleware';

const router = Router();

router.post('/', authMiddleware, subscriptionGate, integrationsController.createIntegration);

export default router;
