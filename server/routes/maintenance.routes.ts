import { Hono } from 'hono';
import { authMiddleware, requireRole } from '../middleware/auth.middleware';
import { getMaintenanceLogs, createMaintenance, closeMaintenance } from '../controllers/maintenance.controller';

export const maintenanceRoutes = new Hono();

// Apply auth middleware
maintenanceRoutes.use('/*', authMiddleware);

// GET & POST Routes (Only Fleet Manager)
maintenanceRoutes.get('/', requireRole('FLEET_MANAGER'), getMaintenanceLogs);
maintenanceRoutes.post('/', requireRole('FLEET_MANAGER'), createMaintenance);

// Close Maintenance Route (Only Fleet Manager)
maintenanceRoutes.post('/:id/close', requireRole('FLEET_MANAGER'), closeMaintenance);
