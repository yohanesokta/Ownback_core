import { Context } from 'hono';
import { z } from 'zod';
import {
  getMyProfileService,
  getUserProfileService,
  updateUserProfileService,
} from '../services/user.service.ts';
import { jsonResponse } from '../utils/response.ts';
import { JwtPayload } from '../utils/jwt.ts';
import { updateUserSchema } from '../validations/user.validation.ts';

export const getMyProfileHandler = async (c: Context) => {
  try {
    const userPayload = c.get('user') as JwtPayload;
    const user = await getMyProfileService(userPayload.id);
    return jsonResponse(c, 200, user, 'Profil berhasil diambil');
  } catch (error: any) {
    return jsonResponse(c, 404, null, error.message);
  }
};

export const getUserProfileHandler = async (c: Context) => {
  try {
    const userId = c.req.param('id');
    const user = await getUserProfileService(userId);
    return jsonResponse(c, 200, user, 'Profil user berhasil diambil');
  } catch (error: any) {
    return jsonResponse(c, 404, null, error.message);
  }
};

export const updateUserProfileHandler = async (c: Context) => {
  try {
    const userPayload = c.get('user') as JwtPayload;
    const body = await c.req.json();
    const validatedData = updateUserSchema.parse(body);

    const user = await updateUserProfileService(userPayload.id, validatedData);
    return jsonResponse(c, 200, user, 'Profil berhasil diupdate');
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return jsonResponse(c, 400, error.issues, 'Input tidak valid');
    }
    return jsonResponse(c, 500, null, 'Terjadi kesalahan internal');
  }
};
