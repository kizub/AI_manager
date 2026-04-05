import { Router } from 'express';
import * as ownersController from './owners.controller';

const router = Router();

router.post('/', ownersController.createOwner);

export default router;
