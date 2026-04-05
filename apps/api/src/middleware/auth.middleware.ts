import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthUser, AuthRequest } from '../types/auth.types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    
    if (!decoded.ownerId || !decoded.userId) {
      return res.status(401).json({ error: 'invalid_token_payload' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'unauthorized' });
  }
};
