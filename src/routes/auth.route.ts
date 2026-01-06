import { Hono } from 'hono';
import { registerUserHandler, loginUserHandler } from '../handlers/auth.handler';

const auth = new Hono();

auth.post('/register', registerUserHandler);
auth.post('/login', loginUserHandler);

export default auth;
