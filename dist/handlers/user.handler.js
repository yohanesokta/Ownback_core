"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfileHandler = exports.getUserProfileHandler = exports.getMyProfileHandler = void 0;
const zod_1 = require("zod");
const user_service_1 = require("../services/user.service");
const response_1 = require("../utils/response");
const user_validation_1 = require("../validations/user.validation");
const getMyProfileHandler = async (c) => {
    try {
        const userPayload = c.get('user');
        const user = await (0, user_service_1.getMyProfileService)(userPayload.id);
        return (0, response_1.jsonResponse)(c, 200, user, 'Profil berhasil diambil');
    }
    catch (error) {
        return (0, response_1.jsonResponse)(c, 404, null, error.message);
    }
};
exports.getMyProfileHandler = getMyProfileHandler;
const getUserProfileHandler = async (c) => {
    try {
        const userId = c.req.param('id');
        const user = await (0, user_service_1.getUserProfileService)(userId);
        return (0, response_1.jsonResponse)(c, 200, user, 'Profil user berhasil diambil');
    }
    catch (error) {
        return (0, response_1.jsonResponse)(c, 404, null, error.message);
    }
};
exports.getUserProfileHandler = getUserProfileHandler;
const updateUserProfileHandler = async (c) => {
    try {
        const userPayload = c.get('user');
        const body = await c.req.json();
        const validatedData = user_validation_1.updateUserSchema.parse(body);
        const user = await (0, user_service_1.updateUserProfileService)(userPayload.id, validatedData);
        return (0, response_1.jsonResponse)(c, 200, user, 'Profil berhasil diupdate');
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return (0, response_1.jsonResponse)(c, 400, error.issues, 'Input tidak valid');
        }
        return (0, response_1.jsonResponse)(c, 500, null, 'Terjadi kesalahan internal');
    }
};
exports.updateUserProfileHandler = updateUserProfileHandler;
