import { Router } from 'express';
import * as widgetController from './widget.controller';

const router = Router();

router.post('/init', widgetController.initWidget);

export default router;
