"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommentSchema = exports.createPostSchema = void 0;
const zod_1 = require("zod");
exports.createPostSchema = zod_1.z.object({
    caption: zod_1.z.string().min(1, { message: 'Caption tidak boleh kosong' }),
    images: zod_1.z.array(zod_1.z.string().url({ message: 'URL gambar tidak valid' })).min(1, { message: 'Minimal 1 gambar' }).max(5, { message: 'Maksimal 5 gambar' }),
});
exports.createCommentSchema = zod_1.z.object({
    text: zod_1.z.string().min(1, { message: 'Komentar tidak boleh kosong' }),
});
