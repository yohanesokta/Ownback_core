"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.repostService = exports.getCommentsService = exports.createCommentService = exports.likeUnlikePostService = void 0;
const client_1 = require("../db/client");
const cuid_1 = __importDefault(require("cuid"));
const likeUnlikePostService = async (userId, postId) => {
    const { rows: likes } = await (0, client_1.query)('SELECT * FROM likes WHERE "userId" = $1 AND "postId" = $2', [userId, postId]);
    const like = likes[0];
    if (like) {
        await (0, client_1.query)('DELETE FROM likes WHERE "userId" = $1 AND "postId" = $2', [userId, postId]);
        return { status: 'unliked' };
    }
    else {
        await (0, client_1.query)('INSERT INTO likes("userId", "postId") VALUES($1, $2)', [userId, postId]);
        return { status: 'liked' };
    }
};
exports.likeUnlikePostService = likeUnlikePostService;
const createCommentService = async (userId, postId, body) => {
    const id = (0, cuid_1.default)();
    const { rows } = await (0, client_1.query)(`INSERT INTO comments(id, text, "userId", "postId") 
         VALUES($1, $2, $3, $4) 
         RETURNING id, text, "createdAt"`, [id, body.text, userId, postId]);
    const newComment = rows[0];
    const { rows: users } = await (0, client_1.query)('SELECT id, name, "profilePictureUrl" FROM users WHERE id = $1', [userId]);
    return { ...newComment, user: users[0] };
};
exports.createCommentService = createCommentService;
const getCommentsService = async (postId) => {
    const { rows: comments } = await (0, client_1.query)(`SELECT
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
         ORDER BY c."createdAt" ASC`, [postId]);
    return comments;
};
exports.getCommentsService = getCommentsService;
const repostService = async (userId, postId) => {
    const { rows: existingReposts } = await (0, client_1.query)('SELECT * FROM reposts WHERE "userId" = $1 AND "postId" = $2', [userId, postId]);
    if (existingReposts.length > 0) {
        throw new Error('You have already reposted this.');
    }
    const id = (0, cuid_1.default)();
    const { rows } = await (0, client_1.query)('INSERT INTO reposts(id, "userId", "postId") VALUES($1, $2, $3) RETURNING *', [id, userId, postId]);
    return rows[0];
};
exports.repostService = repostService;
