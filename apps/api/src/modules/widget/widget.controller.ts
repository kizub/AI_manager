import { Request, Response } from 'express';
import * as widgetService from './widget.service';

export const initWidget = async (req: Request, res: Response) => {
  const { projectId } = req.body;
  const result = await widgetService.initWidget(projectId);
  res.json(result);
};
