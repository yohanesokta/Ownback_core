import { prisma } from '../db/client';
import { comparePassword, hashPassword } from '../utils/password';
import { createToken } from '../utils/jwt';
import type { z } from 'zod';
import type { loginSchema, registerSchema } from '../validations/auth.validation';

export const registerUserService = async (body: z.infer<typeof registerSchema>) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: body.email },
  });

  if (existingUser) {
    throw new Error('Email sudah terdaftar');
  }

  const hashedPassword = await hashPassword(body.password);

  const user = await prisma.user.create({
    data: {
      ...body,
      password: hashedPassword,
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const loginUserService = async (body: z.infer<typeof loginSchema>) => {
  const user = await prisma.user.findUnique({
    where: { email: body.email },
  });

  if (!user) {
    throw new Error('Email atau password salah');
  }

  const isPasswordValid = await comparePassword(body.password, user.password);

  if (!isPasswordValid) {
    throw new Error('Email atau password salah');
  }

  const token = await createToken(user.id, user.email);
  return { token };
};
