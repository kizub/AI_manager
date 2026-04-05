import { Request, Response } from 'express';
import * as ownersService from './owners.service';

export const createOwner = async (req: Request, res: Response) => {
  const { email } = req.body;
  const result = await ownersService.createOwner(email);
  res.json(result);
};
