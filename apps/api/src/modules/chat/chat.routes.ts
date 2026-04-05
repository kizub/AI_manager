import { Router } from 'express';
import * as chatController from './chat.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

router.post('/message', chatController.createMessage);
router.post('/lead', chatController.submitLead);
router.get('/leads', authMiddleware, chatController.getLeadsHandler);
router.get('/leads/:leadId', authMiddleware, chatController.getLeadByIdHandler);
router.patch('/leads/:leadId/status', authMiddleware, chatController.updateLeadStatusHandler);

export default router;
