import { Hono } from 'hono';
import { authMiddleware, requireRole } from '../middleware/auth.middleware';
import { 
  getVehicles, 
  getVehicleById, 
  createVehicle, 
  updateVehicle, 
  deleteVehicle 
} from '../controllers/vehicle.controller';

export const vehicleRoutes = new Hono();

// Apply auth middleware to all vehicle routes
vehicleRoutes.use('/*', authMiddleware);

// GET routes (All roles can view, or adjust as per your RBAC matrix)
// According to matrix: Fleet Manager (Full), Dispatcher (View), Financial (View)
vehicleRoutes.get('/', requireRole('FLEET_MANAGER', 'DISPATCHER', 'FINANCIAL_ANALYST'), getVehicles);
vehicleRoutes.get('/:id', requireRole('FLEET_MANAGER', 'DISPATCHER', 'FINANCIAL_ANALYST'), getVehicleById);

// POST, PUT, DELETE (Only Fleet Manager can do this)
vehicleRoutes.post('/', requireRole('FLEET_MANAGER'), createVehicle);
vehicleRoutes.put('/:id', requireRole('FLEET_MANAGER'), updateVehicle);
vehicleRoutes.delete('/:id', requireRole('FLEET_MANAGER'), deleteVehicle);
