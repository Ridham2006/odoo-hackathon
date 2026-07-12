import { verify } from 'hono/jwt';
import type { Context, Next } from 'hono';

// Authenticate User (Check JWT)
export const authMiddleware = async (c: Context, next: Next) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'No token provided' }, 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = await verify(token, process.env.JWT_SECRET || 'transitops_super_secret');
    
    // Set user info in context for next middlewares/routes
    c.set('user', decoded);
    await next();
  } catch (error) {
    return c.json({ error: 'Invalid or expired token' }, 401);
  }
};

// Role Based Access Control (RBAC)
export const requireRole = (...allowedRoles: string[]) => {
  return async (c: Context, next: Next) => {
    const user = c.get('user');
    if (!user || !allowedRoles.includes(user.role)) {
      return c.json({ error: 'Access denied. Insufficient permissions.' }, 403);
    }
    await next();
  };
};
