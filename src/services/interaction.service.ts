import { query } from '../db/client.ts';
import type { z } from 'zod';
import type { createCommentSchema } from '../validations/post.validation.ts';
import cuid from 'cuid';

export const likeUnlikePostService = async (userId: string, postId: string) => {
  const { rows: likes } = await query('SELECT * FROM likes WHERE "userId" = $1 AND "postId" = $2', [userId, postId]);
  const like = likes[0];

  if (like) {
    await query('DELETE FROM likes WHERE "userId" = $1 AND "postId" = $2', [userId, postId]);
    return { status: 'unliked' };
  } else {
    await query('INSERT INTO likes("userId", "postId") VALUES($1, $2)', [userId, postId]);
    return { status: 'liked' };
  }
};

export const createCommentService = async (
  userId: string,
  postId: string,
  body: z.infer<typeof createCommentSchema>
) => {
    const id = cuid();
    const { rows } = await query(
        `INSERT INTO comments(id, text, "userId", "postId") 
         VALUES($1, $2, $3, $4) 
         RETURNING id, text, "createdAt"`,
        [id, body.text, userId, postId]
    );
    const newComment = rows[0];

    const { rows: users } = await query('SELECT id, name, "profilePictureUrl" FROM users WHERE id = $1', [userId]);
    
    return { ...newComment, user: users[0] };
};

export const getCommentsService = async (postId: string) => {
    const { rows: comments } = await query(
        `SELECT
            c.id,
            c.text,
            c."createdAt",
            json_build_object(
                'id', u.id,
                'name', u.name,
                'profilePictureUrl', u."profilePictureUrl"
            ) AS user
         FROM comments c
         JOIN users u ON c."userId" = u.id
         WHERE c."postId" = $1
         ORDER BY c."createdAt" ASC`,
        [postId]
    );
    return comments;
}

export const repostService = async (userId: string, postId: string) => {
    const { rows: existingReposts } = await query('SELECT * FROM reposts WHERE "userId" = $1 AND "postId" = $2', [userId, postId]);

    if (existingReposts.length > 0) {
        throw new Error('You have already reposted this.');
    }

    const id = cuid();
    const { rows } = await query(
        'INSERT INTO reposts(id, "userId", "postId") VALUES($1, $2, $3) RETURNING *',
        [id, userId, postId]
    );
    return rows[0];
}
