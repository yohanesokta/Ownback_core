"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const user_handler_1 = require("../handlers/user.handler");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const users = new hono_1.Hono();
// Protected routes
users.use('/*', auth_middleware_1.authMiddleware);
users.get('/me', user_handler_1.getMyProfileHandler);
users.patch('/me', user_handler_1.updateUserProfileHandler);
// Public route
users.get('/:id', user_handler_1.getUserProfileHandler);
exports.default = users;
