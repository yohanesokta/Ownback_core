import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set. Please check your .env file.');
}

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const query = (text: string, params: any[]) => pool.query(text, params);