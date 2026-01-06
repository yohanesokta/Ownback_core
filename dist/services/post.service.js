"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostsByUserService = exports.getFeedService = exports.createPostService = void 0;
const client_1 = require("../db/client");
const cuid_1 = __importDefault(require("cuid"));
const createPostService = async (userId, body) => {
    const { caption, images } = body;
    const client = await client_1.pool.connect();
    try {
        await client.query('BEGIN');
        const postId = (0, cuid_1.default)();
        const { rows: newPosts } = await client.query('INSERT INTO posts(id, caption, "authorId") VALUES($1, $2, $3) RETURNING *', [postId, caption, userId]);
        const post = newPosts[0];
        const imagePromises = images.map((imageUrl) => {
            const imageId = (0, cuid_1.default)();
            return client.query('INSERT INTO post_images(id, url, "postId") VALUES($1, $2, $3)', [imageId, imageUrl, postId]);
        });
        await Promise.all(imagePromises);
        const { rows: postImages } = await client.query('SELECT url FROM post_images WHERE "postId" = $1', [postId]);
        await client.query('COMMIT');
        return { ...post, images: postImages };
    }
    catch (e) {
        await client.query('ROLLBACK');
        throw e;
    }
    finally {
        client.release();
    }
};
exports.createPostService = createPostService;
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
const getFeedService = async (currentUserId) => {
    const fullQuery = `${getPostsQuery} ORDER BY p."createdAt" DESC`;
    const { rows: posts } = await (0, client_1.query)(fullQuery, [currentUserId]);
    return posts;
};
exports.getFeedService = getFeedService;
const getPostsByUserService = async (userId, currentUserId) => {
    const fullQuery = `${getPostsQuery} WHERE p."authorId" = $2 ORDER BY p."createdAt" DESC`;
    const { rows: posts } = await (0, client_1.query)(fullQuery, [currentUserId, userId]);
    return posts;
};
exports.getPostsByUserService = getPostsByUserService;
