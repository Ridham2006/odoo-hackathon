import { Hono } from 'hono';
import { authMiddleware, requireRole } from '../middleware/auth.middleware';
import { 
  getDashboardKPIs, 
  getAnalytics,
  getVehicleStatusDistribution,
  getTripStatusDistribution,
  getMonthlyFuelTrend,
  getDriverStatusDistribution,
  getExpenseBreakdown
} from '../controllers/analytics.controller';

export const analyticsRoutes = new Hono();

// Apply auth middleware
analyticsRoutes.use('/*', authMiddleware);

// Dashboard KPIs (All roles can view dashboard)
analyticsRoutes.get('/dashboard', getDashboardKPIs);

// Financial Analytics (Fleet Manager & Financial Analyst)
analyticsRoutes.get('/', requireRole('FLEET_MANAGER', 'FINANCIAL_ANALYST'), getAnalytics);

// Distribution & Trend Endpoints
analyticsRoutes.get('/vehicle-status', requireRole('FLEET_MANAGER', 'FINANCIAL_ANALYST'), getVehicleStatusDistribution);
analyticsRoutes.get('/trip-status', requireRole('FLEET_MANAGER', 'FINANCIAL_ANALYST'), getTripStatusDistribution);
analyticsRoutes.get('/monthly-fuel', requireRole('FLEET_MANAGER', 'FINANCIAL_ANALYST'), getMonthlyFuelTrend);
analyticsRoutes.get('/driver-status', requireRole('FLEET_MANAGER', 'FINANCIAL_ANALYST'), getDriverStatusDistribution);
analyticsRoutes.get('/expense-breakdown', requireRole('FLEET_MANAGER', 'FINANCIAL_ANALYST'), getExpenseBreakdown);
