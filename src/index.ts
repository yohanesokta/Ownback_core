import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';

import auth from './routes/auth.route';
import users from './routes/user.route';
import posts from './routes/post.route';

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