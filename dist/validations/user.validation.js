"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = void 0;
const zod_1 = require("zod");
exports.updateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, { message: 'Nama minimal 3 karakter' }).optional(),
    profilePictureUrl: zod_1.z.string().url({ message: 'URL foto profil tidak valid' }).optional(),
    description: zod_1.z.string().optional(),
});
