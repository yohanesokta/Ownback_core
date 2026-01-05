import { pool, query } from '../db/client.ts';
import type { z } from 'zod';
import type { createPostSchema } from '../validations/post.validation.ts';
import cuid from 'cuid';

export const createPostService = async (
  userId: string,
  body: z.infer<typeof createPostSchema>
) => {
  const { caption, images } = body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const postId = cuid();
    const { rows: newPosts } = await client.query(
      'INSERT INTO posts(id, caption, "authorId") VALUES($1, $2, $3) RETURNING *',
      [postId, caption, userId]
    );
    const post = newPosts[0];

    const imagePromises = images.map((imageUrl) => {
      const imageId = cuid();
      return client.query(
        'INSERT INTO post_images(id, url, "postId") VALUES($1, $2, $3)',
        [imageId, imageUrl, postId]
      );
    });
    await Promise.all(imagePromises);

    const { rows: postImages } = await client.query('SELECT url FROM post_images WHERE "postId" = $1', [postId]);

    await client.query('COMMIT');

    return { ...post, images: postImages };
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

const getPostsQuery = `
    SELECT
        p.id,
        p.caption,
        p."createdAt",
        json_build_object(
            'id', u.id,
            'name', u.name,
            'profilePictureUrl', u."profilePictureUrl"
        ) AS author,
        (SELECT json_agg(json_build_object('url', pi.url)) FROM post_images pi WHERE pi."postId" = p.id) AS images,
        (SELECT COUNT(*) FROM likes l WHERE l."postId" = p.id)::int AS "likesCount",
        (SELECT COUNT(*) FROM comments c WHERE c."postId" = p.id)::int AS "commentsCount",
        (SELECT COUNT(*) FROM reposts r WHERE r."postId" = p.id)::int AS "repostsCount",
        EXISTS(SELECT 1 FROM likes l WHERE l."postId" = p.id AND l."userId" = $1) AS "isLiked"
    FROM posts p
    JOIN users u ON p."authorId" = u.id
`;

export const getFeedService = async (currentUserId: string) => {
    const fullQuery = `${getPostsQuery} ORDER BY p."createdAt" DESC`;
    const { rows: posts } = await query(fullQuery, [currentUserId]);
    return posts;
};

export const getPostsByUserService = async (userId: string, currentUserId: string) => {
    const fullQuery = `${getPostsQuery} WHERE p."authorId" = $2 ORDER BY p."createdAt" DESC`;
    const { rows: posts } = await query(fullQuery, [currentUserId, userId]);
    return posts;
}
