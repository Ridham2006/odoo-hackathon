import { Hono } from 'hono';
import { authMiddleware, requireRole } from '../middleware/auth.middleware';
import { getDashboardKPIs, getAnalytics } from '../controllers/analytics.controller';

export const analyticsRoutes = new Hono();

// Apply auth middleware
analyticsRoutes.use('/*', authMiddleware);

// Dashboard KPIs (All roles can view dashboard)
analyticsRoutes.get('/dashboard', getDashboardKPIs);

// Financial Analytics (Fleet Manager & Financial Analyst)
analyticsRoutes.get('/', requireRole('FLEET_MANAGER', 'FINANCIAL_ANALYST'), getAnalytics);
