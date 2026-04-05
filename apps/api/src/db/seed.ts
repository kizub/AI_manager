import bcrypt from 'bcryptjs';
import prisma from './prisma.ts';

async function main() {
  const email = 'admin@test.com';
  const password = '123456';
  const name = 'Admin';
  const projectName = 'Test Project';

  console.log('Seeding database...');

  // 1. Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 2. Create User and Owner
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
    },
    create: {
      email,
      password: hashedPassword,
      owner: {
        create: {},
      },
    },
    include: {
      owner: true,
    },
  });

  if (!user.owner) {
    throw new Error('Failed to create owner');
  }

  // 3. Create or find Project
  let project = await prisma.project.findFirst({
    where: {
      name: projectName,
      ownerId: user.owner.id,
    },
  });

  if (!project) {
    project = await prisma.project.create({
      data: {
        name: projectName,
        ownerId: user.owner.id,
      },
    });
  }

  console.log('Seed completed successfully!');
  console.log({
    email: email,
    password: password,
    projectId: project.id,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
