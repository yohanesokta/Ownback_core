"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const post_handler_1 = require("../handlers/post.handler");
const interaction_handler_1 = require("../handlers/interaction.handler");
const posts = new hono_1.Hono();
// All post routes are protected
posts.use('/*', auth_middleware_1.authMiddleware);
// Post creation and retrieval
posts.post('/', post_handler_1.createPostHandler);
posts.get('/feed', post_handler_1.getFeedHandler);
posts.get('/user/:userId', post_handler_1.getPostsByUserHandler);
// Interactions
posts.post('/:postId/like', interaction_handler_1.likeUnlikePostHandler);
posts.post('/:postId/repost', interaction_handler_1.repostHandler);
posts.post('/:postId/comment', interaction_handler_1.createCommentHandler);
posts.get('/:postId/comments', interaction_handler_1.getCommentsHandler);
exports.default = posts;
