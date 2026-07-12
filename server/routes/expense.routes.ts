import { Hono } from 'hono';
import { authMiddleware, requireRole } from '../middleware/auth.middleware';
import { 
  getFuelLogs, 
  addFuelLog, 
  getExpenses, 
  addExpense 
} from '../controllers/expense.controller';

export const expenseRoutes = new Hono();

// Apply auth middleware
expenseRoutes.use('/*', authMiddleware);

// FUEL LOGS ROUTES
expenseRoutes.get('/fuel', requireRole('FINANCIAL_ANALYST', 'FLEET_MANAGER'), getFuelLogs);
expenseRoutes.post('/fuel', requireRole('FINANCIAL_ANALYST', 'FLEET_MANAGER'), addFuelLog);

// OTHER EXPENSES ROUTES
expenseRoutes.get('/', requireRole('FINANCIAL_ANALYST', 'FLEET_MANAGER'), getExpenses);
expenseRoutes.post('/', requireRole('FINANCIAL_ANALYST', 'FLEET_MANAGER'), addExpense);
