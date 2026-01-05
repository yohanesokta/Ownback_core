import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z.string().min(3, { message: 'Nama minimal 3 karakter' }).optional(),
  profilePictureUrl: z.string().url({ message: 'URL foto profil tidak valid' }).optional(),
  description: z.string().optional(),
});
