"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserHandler = exports.registerUserHandler = void 0;
const zod_1 = require("zod");
const auth_service_1 = require("../services/auth.service");
const response_1 = require("../utils/response");
const auth_validation_1 = require("../validations/auth.validation");
const registerUserHandler = async (c) => {
    try {
        const body = await c.req.json();
        const validatedData = auth_validation_1.registerSchema.parse(body);
        const user = await (0, auth_service_1.registerUserService)(validatedData);
        return (0, response_1.jsonResponse)(c, 201, user, 'Registrasi berhasil');
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return (0, response_1.jsonResponse)(c, 400, error.issues, 'Input tidak valid');
        }
        return (0, response_1.jsonResponse)(c, 409, null, error.message);
    }
};
exports.registerUserHandler = registerUserHandler;
const loginUserHandler = async (c) => {
    try {
        const body = await c.req.json();
        const validatedData = auth_validation_1.loginSchema.parse(body);
        const result = await (0, auth_service_1.loginUserService)(validatedData);
        return (0, response_1.jsonResponse)(c, 200, result, 'Login berhasil');
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return (0, response_1.jsonResponse)(c, 400, error.issues, 'Input tidak valid');
        }
        return (0, response_1.jsonResponse)(c, 401, null, error.message);
    }
};
exports.loginUserHandler = loginUserHandler;
