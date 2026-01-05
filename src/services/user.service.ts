import { query } from '../db/client.ts';
import type { z } from 'zod';
import type { updateUserSchema } from '../validations/user.validation.ts';

export const getMyProfileService = async (userId: string) => {
  const { rows: users } = await query(
    'SELECT id, email, name, "profilePictureUrl", description, "createdAt" FROM users WHERE id = $1',
    [userId]
  );
  const user = users[0];

  if (!user) {
    throw new Error('User tidak ditemukan');
  }

  const { rows: postCounts } = await query('SELECT COUNT(*) AS post_count FROM posts WHERE "authorId" = $1', [userId]);
  user.posts = postCounts[0].post_count;

  return user;
};

export const getUserProfileService = async (userId: string) => {
    const { rows: users } = await query(
        'SELECT id, name, "profilePictureUrl", description, "createdAt" FROM users WHERE id = $1',
        [userId]
      );
    const user = users[0];

    if (!user) {
        throw new Error('User tidak ditemukan');
    }

    const { rows: postCounts } = await query('SELECT COUNT(*) AS post_count FROM posts WHERE "authorId" = $1', [userId]);
    user.posts = postCounts[0].post_count;

    return user;
  };

export const updateUserProfileService = async (
  userId: string,
  body: z.infer<typeof updateUserSchema>
) => {
  const { name, description, profilePictureUrl } = body;

  // Dynamically build the update query
  const fields: any = {};
  const values: any[] = [];
  let paramIndex = 1;

  if (name) {
    fields.name = `$${paramIndex++}`;
    values.push(name);
  }
  if (description) {
    fields.description = `$${paramIndex++}`;
    values.push(description);
  }
  if (profilePictureUrl) {
    fields.profilePictureUrl = `$${paramIndex++}`;
    values.push(profilePictureUrl);
  }

  const fieldKeys = Object.keys(fields);
  if (fieldKeys.length === 0) {
    throw new Error('Tidak ada data untuk diupdate');
  }

  const setClause = fieldKeys.map((key) => `"${key}" = ${fields[key]}`).join(', ');
  values.push(userId);

  const { rows: updatedUsers } = await query(
    `UPDATE users SET ${setClause}, "updatedAt" = current_timestamp WHERE id = $${paramIndex} RETURNING *`,
    values
  );

  const updatedUser = updatedUsers[0];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};
