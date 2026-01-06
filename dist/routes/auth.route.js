"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const auth_handler_1 = require("../handlers/auth.handler");
const auth = new hono_1.Hono();
auth.post('/register', auth_handler_1.registerUserHandler);
auth.post('/login', auth_handler_1.loginUserHandler);
exports.default = auth;
