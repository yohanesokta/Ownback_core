"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.repostHandler = exports.getCommentsHandler = exports.createCommentHandler = exports.likeUnlikePostHandler = void 0;
const zod_1 = require("zod");
const response_1 = require("../utils/response");
const post_validation_1 = require("../validations/post.validation");
const interaction_service_1 = require("../services/interaction.service");
const likeUnlikePostHandler = async (c) => {
    try {
        const userPayload = c.get('user');
        const postId = c.req.param('postId');
        const result = await (0, interaction_service_1.likeUnlikePostService)(userPayload.id, postId);
        return (0, response_1.jsonResponse)(c, 200, result, `Post ${result.status}`);
    }
    catch (error) {
        return (0, response_1.jsonResponse)(c, 500, null, 'Terjadi kesalahan internal');
    }
};
exports.likeUnlikePostHandler = likeUnlikePostHandler;
const createCommentHandler = async (c) => {
    try {
        const userPayload = c.get('user');
        const postId = c.req.param('postId');
        const body = await c.req.json();
        const validatedData = post_validation_1.createCommentSchema.parse(body);
        const comment = await (0, interaction_service_1.createCommentService)(userPayload.id, postId, validatedData);
        return (0, response_1.jsonResponse)(c, 201, comment, 'Komentar berhasil ditambahkan');
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return (0, response_1.jsonResponse)(c, 400, error.issues, 'Input tidak valid');
        }
        return (0, response_1.jsonResponse)(c, 500, null, 'Terjadi kesalahan internal');
    }
};
exports.createCommentHandler = createCommentHandler;
const getCommentsHandler = async (c) => {
    try {
        const postId = c.req.param('postId');
        const comments = await (0, interaction_service_1.getCommentsService)(postId);
        return (0, response_1.jsonResponse)(c, 200, comments, 'Komentar berhasil diambil');
    }
    catch (error) {
        return (0, response_1.jsonResponse)(c, 500, null, 'Terjadi kesalahan internal');
    }
};
exports.getCommentsHandler = getCommentsHandler;
const repostHandler = async (c) => {
    try {
        const userPayload = c.get('user');
        const postId = c.req.param('postId');
        const repost = await (0, interaction_service_1.repostService)(userPayload.id, postId);
        return (0, response_1.jsonResponse)(c, 201, repost, 'Post berhasil di-repost');
    }
    catch (error) {
        return (0, response_1.jsonResponse)(c, 409, null, error.message);
    }
};
exports.repostHandler = repostHandler;
