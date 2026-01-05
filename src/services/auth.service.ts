import { query } from '../db/client.ts';
import { comparePassword, hashPassword } from '../utils/password.ts';
import { createToken } from '../utils/jwt.ts';
import type { z } from 'zod';
import type { loginSchema, registerSchema } from '../validations/auth.validation.ts';
import cuid from 'cuid';

export const registerUserService = async (body: z.infer<typeof registerSchema>) => {
  const { name, email, profilePictureUrl, description } = body;
  
  const { rows: existingUsers } = await query('SELECT * FROM users WHERE email = $1', [email]);
  if (existingUsers.length > 0) {
    throw new Error('Email sudah terdaftar');
  }

  const hashedPassword = await hashPassword(body.password);
  const id = cuid();

  const { rows: newUsers } = await query(
    'INSERT INTO users(id, name, email, password, "profilePictureUrl", description) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
    [id, name, email, hashedPassword, profilePictureUrl, description]
  );
  
  const newUser = newUsers[0];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

export const loginUserService = async (body: z.infer<typeof loginSchema>) => {
  const { email, password } = body;

  const { rows: users } = await query('SELECT * FROM users WHERE email = $1', [email]);
  const user = users[0];

  if (!user) {
    throw new Error('Email atau password salah');
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Email atau password salah');
  }

  const token = await createToken(user.id, user.email);
  return { token };
};
