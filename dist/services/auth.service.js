"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserService = exports.registerUserService = void 0;
const client_1 = require("../db/client");
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
const cuid_1 = __importDefault(require("cuid"));
const registerUserService = async (body) => {
    const { name, email, profilePictureUrl, description } = body;
    const { rows: existingUsers } = await (0, client_1.query)('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUsers.length > 0) {
        throw new Error('Email sudah terdaftar');
    }
    const hashedPassword = await (0, password_1.hashPassword)(body.password);
    const id = (0, cuid_1.default)();
    const { rows: newUsers } = await (0, client_1.query)('INSERT INTO users(id, name, email, password, "profilePictureUrl", description) VALUES($1, $2, $3, $4, $5, $6) RETURNING *', [id, name, email, hashedPassword, profilePictureUrl, description]);
    const newUser = newUsers[0];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
};
exports.registerUserService = registerUserService;
const loginUserService = async (body) => {
    const { email, password } = body;
    const { rows: users } = await (0, client_1.query)('SELECT * FROM users WHERE email = $1', [email]);
    const user = users[0];
    if (!user) {
        throw new Error('Email atau password salah');
    }
    const isPasswordValid = await (0, password_1.comparePassword)(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Email atau password salah');
    }
    const token = await (0, jwt_1.createToken)(user.id, user.email);
    return { token };
};
exports.loginUserService = loginUserService;
