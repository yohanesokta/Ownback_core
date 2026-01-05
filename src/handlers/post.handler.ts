import { Context } from 'hono';
import { z } from 'zod';
import { jsonResponse } from '../utils/response.ts';
import { JwtPayload } from '../utils/jwt.ts';
import { createPostSchema } from '../validations/post.validation.ts';
import { createPostService, getFeedService, getPostsByUserService } from '../services/post.service.ts';

export const createPostHandler = async (c: Context) => {
  try {
    const userPayload = c.get('user') as JwtPayload;
    const body = await c.req.json();
    const validatedData = createPostSchema.parse(body);

    const post = await createPostService(userPayload.id, validatedData);
    return jsonResponse(c, 201, post, 'Postingan berhasil dibuat');
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return jsonResponse(c, 400, error.issues, 'Input tidak valid');
    }
    return jsonResponse(c, 500, null, 'Terjadi kesalahan internal');
  }
};

export const getFeedHandler = async (c: Context) => {
    try {
        const userPayload = c.get('user') as JwtPayload;
        const posts = await getFeedService(userPayload.id);
        return jsonResponse(c, 200, posts, 'Feed berhasil diambil');
    } catch (error: any) {
        return jsonResponse(c, 500, null, 'Terjadi kesalahan internal');
    }
}

export const getPostsByUserHandler = async (c: Context) => {
    try {
        const userPayload = c.get('user') as JwtPayload;
        const userId = c.req.param('userId');
        const posts = await getPostsByUserService(userId, userPayload.id);
        return jsonResponse(c, 200, posts, 'Postingan user berhasil diambil');
    } catch (error: any) {
        return jsonResponse(c, 500, null, 'Terjadi kesalahan internal');
    }
}
