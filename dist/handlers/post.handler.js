"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostsByUserHandler = exports.getFeedHandler = exports.createPostHandler = void 0;
const zod_1 = require("zod");
const response_1 = require("../utils/response");
const post_validation_1 = require("../validations/post.validation");
const post_service_1 = require("../services/post.service");
const createPostHandler = async (c) => {
    try {
        const userPayload = c.get('user');
        const body = await c.req.json();
        const validatedData = post_validation_1.createPostSchema.parse(body);
        const post = await (0, post_service_1.createPostService)(userPayload.id, validatedData);
        return (0, response_1.jsonResponse)(c, 201, post, 'Postingan berhasil dibuat');
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return (0, response_1.jsonResponse)(c, 400, error.issues, 'Input tidak valid');
        }
        return (0, response_1.jsonResponse)(c, 500, null, 'Terjadi kesalahan internal');
    }
};
exports.createPostHandler = createPostHandler;
const getFeedHandler = async (c) => {
    try {
        const userPayload = c.get('user');
        const posts = await (0, post_service_1.getFeedService)(userPayload.id);
        return (0, response_1.jsonResponse)(c, 200, posts, 'Feed berhasil diambil');
    }
    catch (error) {
        return (0, response_1.jsonResponse)(c, 500, null, 'Terjadi kesalahan internal');
    }
};
exports.getFeedHandler = getFeedHandler;
const getPostsByUserHandler = async (c) => {
    try {
        const userPayload = c.get('user');
        const userId = c.req.param('userId');
        const posts = await (0, post_service_1.getPostsByUserService)(userId, userPayload.id);
        return (0, response_1.jsonResponse)(c, 200, posts, 'Postingan user berhasil diambil');
    }
    catch (error) {
        return (0, response_1.jsonResponse)(c, 500, null, 'Terjadi kesalahan internal');
    }
};
exports.getPostsByUserHandler = getPostsByUserHandler;
