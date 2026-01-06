"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = void 0;
const jwt_1 = require("hono/jwt");
const createToken = async (id, email) => {
    const payload = { id, email };
    const secret = process.env.JWT_SECRET;
    const token = await (0, jwt_1.sign)(payload, secret);
    return token;
};
exports.createToken = createToken;
