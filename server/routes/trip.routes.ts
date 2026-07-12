import { Hono } from 'hono';
import { authMiddleware, requireRole } from '../middleware/auth.middleware';
import { 
  getTrips, 
  getTripById, 
  createTrip, 
  dispatchTrip, 
  completeTrip, 
  cancelTrip 
} from '../controllers/trip.controller';

export const tripRoutes = new Hono();

// Apply auth middleware to all trip routes
tripRoutes.use('/*', authMiddleware);

// GET routes (Dispatcher & Safety Officer can view)
tripRoutes.get('/', requireRole('DISPATCHER', 'SAFETY_OFFICER'), getTrips);
tripRoutes.get('/:id', requireRole('DISPATCHER', 'SAFETY_OFFICER'), getTripById);

// POST & Status Change Routes (Dispatcher & Fleet Manager can do this)
tripRoutes.post('/', requireRole('DISPATCHER', 'FLEET_MANAGER'), createTrip);
tripRoutes.post('/:id/dispatch', requireRole('DISPATCHER', 'FLEET_MANAGER'), dispatchTrip);
tripRoutes.post('/:id/complete', requireRole('DISPATCHER', 'FLEET_MANAGER'), completeTrip);
tripRoutes.post('/:id/cancel', requireRole('DISPATCHER', 'FLEET_MANAGER'), cancelTrip);
