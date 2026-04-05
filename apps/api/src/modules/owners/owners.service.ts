import prisma from '../../db/prisma';

export const createOwner = async (email: string) => {
  const user = await prisma.user.create({
    data: {
      email,
    },
  });

  const owner = await prisma.owner.create({
    data: {
      userId: user.id,
    },
  });

  return { user, owner };
};
