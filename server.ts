import 'dotenv/config';
import express from 'express';
import bcrypt from 'bcryptjs';
import prisma from './apps/api/src/db/prisma.ts';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './apps/api/src/routes/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3005;

  app.use(express.json());

  // API routes
  app.use(apiRoutes);

  // Bootstrap route
  app.get('/__bootstrap', async (req, res) => {
    const token = req.query.token;
    const secret = process.env.BOOTSTRAP_TOKEN;

    if (!secret || token !== secret) {
      return res.status(403).json({ error: 'forbidden' });
    }

    try {
      const email = 'admin@test.com';
      const password = '123456';
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create or update user and owner
      const user = await prisma.user.upsert({
        where: { email },
        update: { password: hashedPassword },
        create: {
          email,
          password: hashedPassword,
          owner: { create: {} },
        },
        include: { owner: true },
      });

      if (!user.owner) {
        throw new Error('Failed to create owner');
      }

      // Create or find project
      let project = await prisma.project.findFirst({
        where: {
          name: 'Test Project',
          ownerId: user.owner.id,
        },
      });

      if (!project) {
        project = await prisma.project.create({
          data: {
            name: 'Test Project',
            ownerId: user.owner.id,
          },
        });
      }

      res.json({
        email,
        password,
        projectId: project.id,
      });
    } catch (error) {
      console.error('Bootstrap error:', error);
      res.status(500).json({ error: 'internal_server_error' });
    }
  });

  // Static serving and SPA fallback for production
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    // Vite middleware for development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Full-Stack] Server running on http://localhost:${PORT}`);
  });
}

startServer();
