import { createMiddleware } from 'hono/factory';
import { jwt } from 'hono/jwt';
import { jsonResponse } from '../utils/response';
import { JwtPayload } from '../utils/jwt';

export const authMiddleware = createMiddleware(async (c, next) => {
  const auth = jwt({
    secret: process.env.JWT_SECRET!,
  });

  // Workaround to get the middleware to execute and check the token
  let tokenIsValid = false;
  const unauthorizedResponse = await auth(c, async () => {
    tokenIsValid = true;
  });

  if (!tokenIsValid) {
    return jsonResponse(c, 401, null, 'Akses tidak diizinkan: Token tidak valid atau tidak ada');
  }
  
  const payload = c.get('jwtPayload') as JwtPayload;

  // Attach user to context
  c.set('user', payload);

  await next();
});
