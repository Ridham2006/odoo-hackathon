import { Hono } from 'hono';
import { authMiddleware, requireRole } from '../middleware/auth.middleware';
import { 
  getDrivers, 
  getDriverById, 
  createDriver, 
  updateDriver, 
  deleteDriver 
} from '../controllers/driver.controller';

export const driverRoutes = new Hono();

// Apply auth middleware to all driver routes
driverRoutes.use('/*', authMiddleware);

// GET routes (Fleet Manager & Safety Officer can view)
driverRoutes.get('/', requireRole('FLEET_MANAGER', 'SAFETY_OFFICER'), getDrivers);
driverRoutes.get('/:id', requireRole('FLEET_MANAGER', 'SAFETY_OFFICER'), getDriverById);

// POST, PUT, DELETE (Only Fleet Manager can do this)
driverRoutes.post('/', requireRole('FLEET_MANAGER'), createDriver);
driverRoutes.put('/:id', requireRole('FLEET_MANAGER'), updateDriver);
driverRoutes.delete('/:id', requireRole('FLEET_MANAGER'), deleteDriver);
