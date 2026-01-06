"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, { message: 'Nama minimal 3 karakter' }),
    email: zod_1.z.string().email({ message: 'Email tidak valid' }),
    password: zod_1.z.string().min(6, { message: 'Password minimal 6 karakter' }),
    profilePictureUrl: zod_1.z.string().url({ message: 'URL foto profil tidak valid' }).optional(),
    description: zod_1.z.string().optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: 'Email tidak valid' }),
    password: zod_1.z.string().min(6, { message: 'Password minimal 6 karakter' }),
});
