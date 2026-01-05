import 'dotenv/config';

// Check for required environment variables
if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set. Please check your .env file.');
}

import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';

import auth from './routes/auth.route.ts';
import users from './routes/user.route.ts';
import posts from './routes/post.route.ts';

const app = new Hono().basePath('/api');

// Middlewares
app.use('*', logger());
app.use('*', cors());


// Routes
app.route('/auth', auth);
app.route('/users', users);
app.route('/posts', posts);

app.get('/', (c) => {
  return c.text('Welcome to the Social Media API!');
});

console.log('Server is running on port 3000');

export default app;