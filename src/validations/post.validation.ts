import { z } from 'zod';

export const createPostSchema = z.object({
  caption: z.string().min(1, { message: 'Caption tidak boleh kosong' }),
  images: z.array(z.string().url({ message: 'URL gambar tidak valid' })).min(1, { message: 'Minimal 1 gambar' }).max(5, { message: 'Maksimal 5 gambar' }),
});

export const createCommentSchema = z.object({
    text: z.string().min(1, { message: 'Komentar tidak boleh kosong' }),
});
