import { Maintenance, Vehicle } from '../models/models';

// GET ALL MAINTENANCE LOGS
export const getMaintenanceLogs = async (c: any) => {
  try {
    const { status } = c.req.query();
    const query: any = {};
    if (status) query.status = status;

    // Populate vehicle details
    const logs = await Maintenance.find(query)
      .populate('vehicle', 'regNo name type')
      .sort({ createdAt: -1 });
      
    return c.json(logs);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// CREATE MAINTENANCE LOG (OPEN)
export const createMaintenance = async (c: any) => {
  try {
    const { vehicle: vehicleId, serviceType, cost, date } = await c.req.json();

    // 1. Validate Vehicle
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return c.json({ error: 'Vehicle not found' }, 404);
    
    // Retired vehicle cannot go to shop
    if (vehicle.status === 'RETIRED') {
      return c.json({ error: 'Cannot add maintenance for a retired vehicle.' }, 400);
    }

    // Create Maintenance Record (Status: OPEN)
    const maintenance = new Maintenance({
      vehicle: vehicleId,
      serviceType,
      cost: cost || 0,
      date: date || Date.now(),
      status: 'OPEN'
    });

    await maintenance.save();

    // 2. Auto Update Vehicle Status to IN_SHOP
    await Vehicle.findByIdAndUpdate(vehicleId, { status: 'IN_SHOP' });

    return c.json(maintenance, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// CLOSE MAINTENANCE LOG (CLOSED -> Vehicle AVAILABLE)
export const closeMaintenance = async (c: any) => {
  try {
    const maintenance = await Maintenance.findById(c.req.param('id'));
    if (!maintenance) return c.json({ error: 'Maintenance log not found' }, 404);

    if (maintenance.status === 'CLOSED') {
      return c.json({ error: 'Maintenance is already closed.' }, 400);
    }

    // Update Maintenance Status
    maintenance.status = 'CLOSED';
    await maintenance.save();

    // 3. Restore Vehicle to AVAILABLE (unless retired)
    const vehicle = await Vehicle.findById(maintenance.vehicle);
    if (vehicle && vehicle.status !== 'RETIRED') {
      vehicle.status = 'AVAILABLE';
      await vehicle.save();
    }

    return c.json({ message: 'Maintenance closed successfully', maintenance });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};
