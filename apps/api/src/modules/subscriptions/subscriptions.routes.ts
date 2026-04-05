import { Router } from 'express';
import * as subscriptionsController from './subscriptions.controller';

const router = Router();

router.post('/', subscriptionsController.createSubscription);

export default router;
