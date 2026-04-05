import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '../../db/prisma';
import { AuthRequest } from '../../types/auth.types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'email_and_password_required' });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { owner: true },
  });

  if (!user || !user.owner || !user.password) {
    return res.status(401).json({ error: 'invalid_credentials' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ error: 'invalid_credentials' });
  }

  const token = jwt.sign(
    { ownerId: user.owner.id, userId: user.id },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    token,
    user: {
      userId: user.id,
      ownerId: user.owner.id,
      email: user.email,
    }
  });
};

export const me = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { owner: true },
  });

  if (!user || !user.owner) {
    return res.status(404).json({ error: 'user_not_found' });
  }

  res.json({
    userId: user.id,
    ownerId: user.owner.id,
    email: user.email,
  });
};
