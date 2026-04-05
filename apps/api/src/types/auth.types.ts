import { Request } from 'express';

export interface AuthUser {
  ownerId: string;
  userId: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}
