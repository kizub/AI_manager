import prisma from './apps/api/src/db/prisma';

async function main() {
  try {
    let project = await prisma.project.findFirst({
      include: {
        subscription: true,
      },
    });

    if (!project) {
      const user = await prisma.user.create({
        data: {
          email: 'test@example.com',
        },
      });

      const owner = await prisma.owner.create({
        data: {
          userId: user.id,
        },
      });

      project = await prisma.project.create({
        data: {
          name: 'Test Project',
          ownerId: owner.id,
          aiConfig: {
            create: {
              model: 'gemini-3-flash-preview',
              prompt: 'You are a helpful assistant.',
            },
          },
          widgetConfig: {
            create: {
              config: JSON.stringify({
                title: 'AI Assistant',
                color: '#000000',
              }),
            },
          },
          subscription: {
            create: {
              plan: 'pro',
              status: 'active',
              expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
            },
          },
        },
        include: {
          subscription: true,
        },
      });
    }

    console.log('PROJECT_ID=' + project.id);
  } catch (err) {
    console.error('Error in main:', err);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
