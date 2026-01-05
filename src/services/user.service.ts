import { prisma } from '../db/client';
import type { z } from 'zod';
import type { updateUserSchema } from '../validations/user.validation';

export const getMyProfileService = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      profilePictureUrl: true,
      description: true,
      createdAt: true,
      _count: {
        select: {
          posts: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error('User tidak ditemukan');
  }
  return user;
};

export const getUserProfileService = async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        profilePictureUrl: true,
        description: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });
  
    if (!user) {
      throw new Error('User tidak ditemukan');
    }
    return user;
  };

export const updateUserProfileService = async (
  userId: string,
  body: z.infer<typeof updateUserSchema>
) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: body,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
