import { Router } from 'express';
import * as projectAiController from './project-ai.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { subscriptionGate } from '../../middleware/subscription.middleware';

const router = Router();

router.post('/', authMiddleware, subscriptionGate, projectAiController.createAIConfig);

export default router;
