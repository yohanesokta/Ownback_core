"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfileService = exports.getUserProfileService = exports.getMyProfileService = void 0;
const client_1 = require("../db/client");
const getMyProfileService = async (userId) => {
    const { rows: users } = await (0, client_1.query)('SELECT id, email, name, "profilePictureUrl", description, "createdAt" FROM users WHERE id = $1', [userId]);
    const user = users[0];
    if (!user) {
        throw new Error('User tidak ditemukan');
    }
    const { rows: postCounts } = await (0, client_1.query)('SELECT COUNT(*) AS post_count FROM posts WHERE "authorId" = $1', [userId]);
    user.posts = postCounts[0].post_count;
    return user;
};
exports.getMyProfileService = getMyProfileService;
const getUserProfileService = async (userId) => {
    const { rows: users } = await (0, client_1.query)('SELECT id, name, "profilePictureUrl", description, "createdAt" FROM users WHERE id = $1', [userId]);
    const user = users[0];
    if (!user) {
        throw new Error('User tidak ditemukan');
    }
    const { rows: postCounts } = await (0, client_1.query)('SELECT COUNT(*) AS post_count FROM posts WHERE "authorId" = $1', [userId]);
    user.posts = postCounts[0].post_count;
    return user;
};
exports.getUserProfileService = getUserProfileService;
const updateUserProfileService = async (userId, body) => {
    const { name, description, profilePictureUrl } = body;
    // Dynamically build the update query
    const fields = {};
    const values = [];
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
    const { rows: updatedUsers } = await (0, client_1.query)(`UPDATE users SET ${setClause}, "updatedAt" = current_timestamp WHERE id = $${paramIndex} RETURNING *`, values);
    const updatedUser = updatedUsers[0];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
};
exports.updateUserProfileService = updateUserProfileService;
