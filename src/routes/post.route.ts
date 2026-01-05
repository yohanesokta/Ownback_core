import { Hono } from 'hono';
import { authMiddleware } from '../middlewares/auth.middleware.ts';
import { createPostHandler, getFeedHandler, getPostsByUserHandler } from '../handlers/post.handler.ts';
import { createCommentHandler, getCommentsHandler, likeUnlikePostHandler, repostHandler } from '../handlers/interaction.handler.ts';

const posts = new Hono();

// All post routes are protected
posts.use('/*', authMiddleware);

// Post creation and retrieval
posts.post('/', createPostHandler);
posts.get('/feed', getFeedHandler);
posts.get('/user/:userId', getPostsByUserHandler);

// Interactions
posts.post('/:postId/like', likeUnlikePostHandler);
posts.post('/:postId/repost', repostHandler);
posts.post('/:postId/comment', createCommentHandler);
posts.get('/:postId/comments', getCommentsHandler);


export default posts;
