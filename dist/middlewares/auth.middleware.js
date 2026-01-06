"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const factory_1 = require("hono/factory");
const jwt_1 = require("hono/jwt");
const response_1 = require("../utils/response");
exports.authMiddleware = (0, factory_1.createMiddleware)(async (c, next) => {
    const auth = (0, jwt_1.jwt)({
        secret: process.env.JWT_SECRET,
    });
    // Workaround to get the middleware to execute and check the token
    let tokenIsValid = false;
    const unauthorizedResponse = await auth(c, async () => {
        tokenIsValid = true;
    });
    if (!tokenIsValid) {
        return (0, response_1.jsonResponse)(c, 401, null, 'Akses tidak diizinkan: Token tidak valid atau tidak ada');
    }
    const payload = c.get('jwtPayload');
    // Attach user to context
    c.set('user', payload);
    await next();
});
