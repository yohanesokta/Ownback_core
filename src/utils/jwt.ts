import { sign } from 'hono/jwt';

export interface JwtPayload {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

export const createToken = async (id: string, email: string) => {
  const payload: Omit<JwtPayload, 'iat' | 'exp'> = { id, email };
  const secret = process.env.JWT_SECRET!;
  const token = await sign(payload, secret);
  return token;
};
