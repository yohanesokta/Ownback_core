"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
// Check for required environment variables
if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set. Please check your .env file.');
}
const hono_1 = require("hono");
const logger_1 = require("hono/logger");
const cors_1 = require("hono/cors");
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const post_route_1 = __importDefault(require("./routes/post.route"));
const app = new hono_1.Hono().basePath('/api');
// Middlewares
app.use('*', (0, logger_1.logger)());
app.use('*', (0, cors_1.cors)());
// Routes
app.route('/auth', auth_route_1.default);
app.route('/users', user_route_1.default);
app.route('/posts', post_route_1.default);
app.get('/', (c) => {
    return c.text('Welcome to the Social Media API!');
});
console.log('Server is running on port 3000');
exports.default = app;
