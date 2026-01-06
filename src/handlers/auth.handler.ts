import { Context } from 'hono';
import { z } from 'zod';
import { registerUserService, loginUserService } from '../services/auth.service';
import { jsonResponse } from '../utils/response';
import { registerSchema, loginSchema } from '../validations/auth.validation';

export const registerUserHandler = async (c: Context) => {
  try {
    const body = await c.req.json();
    const validatedData = registerSchema.parse(body);

    const user = await registerUserService(validatedData);
    return jsonResponse(c, 201, user, 'Registrasi berhasil');
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return jsonResponse(c, 400, error.issues, 'Input tidak valid');
    }
    return jsonResponse(c, 409, null, error.message);
  }
};

export const loginUserHandler = async (c: Context) => {
  try {
    const body = await c.req.json();
    const validatedData = loginSchema.parse(body);
    const result = await loginUserService(validatedData);
    return jsonResponse(c, 200, result, 'Login berhasil');
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return jsonResponse(c, 400, error.issues, 'Input tidak valid');
    }
    return jsonResponse(c, 401, null, error.message);
  }
};
