import { Context } from 'hono';
import { z } from 'zod';
import { jsonResponse } from '../utils/response';
import { JwtPayload } from '../utils/jwt';
import { createCommentSchema } from '../validations/post.validation';
import { createCommentService, getCommentsService, likeUnlikePostService, repostService } from '../services/interaction.service';

export const likeUnlikePostHandler = async (c: Context) => {
    try {
        const userPayload = c.get('user') as JwtPayload;
        const postId = c.req.param('postId');
        const result = await likeUnlikePostService(userPayload.id, postId);
        return jsonResponse(c, 200, result, `Post ${result.status}`);
    } catch (error: any) {
        return jsonResponse(c, 500, null, 'Terjadi kesalahan internal');
    }
}

export const createCommentHandler = async (c: Context) => {
    try {
        const userPayload = c.get('user') as JwtPayload;
        const postId = c.req.param('postId');
        const body = await c.req.json();
        const validatedData = createCommentSchema.parse(body);

        const comment = await createCommentService(userPayload.id, postId, validatedData);
        return jsonResponse(c, 201, comment, 'Komentar berhasil ditambahkan');
    } catch (error: any)
    {
        if (error instanceof z.ZodError) {
            return jsonResponse(c, 400, error.issues, 'Input tidak valid');
        }
        return jsonResponse(c, 500, null, 'Terjadi kesalahan internal');
    }
}

export const getCommentsHandler = async (c: Context) => {
    try {
        const postId = c.req.param('postId');
        const comments = await getCommentsService(postId);
        return jsonResponse(c, 200, comments, 'Komentar berhasil diambil');
    } catch (error: any) {
        return jsonResponse(c, 500, null, 'Terjadi kesalahan internal');
    }
}

export const repostHandler = async (c: Context) => {
    try {
        const userPayload = c.get('user') as JwtPayload;
        const postId = c.req.param('postId');
        const repost = await repostService(userPayload.id, postId);
        return jsonResponse(c, 201, repost, 'Post berhasil di-repost');
    } catch (error: any) {
        return jsonResponse(c, 409, null, error.message);
    }
}
