import { Hono } from 'hono';
import {
  getMyProfileHandler,
  getUserProfileHandler,
  updateUserProfileHandler,
} from '../handlers/user.handler';
import { authMiddleware } from '../middlewares/auth.middleware';

const users = new Hono();

// Protected routes
users.use('/*', authMiddleware);
users.get('/me', getMyProfileHandler);
users.patch('/me', updateUserProfileHandler);

// Public route
users.get('/:id', getUserProfileHandler);


export default users;
