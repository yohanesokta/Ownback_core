"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = exports.pool = void 0;
const pg_1 = require("pg");
if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set. Please check your .env file.');
}
exports.pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
const query = (text, params) => exports.pool.query(text, params);
exports.query = query;
