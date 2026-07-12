import { Vehicle } from '../models/models';
import { VEHICLE_STATUS } from '../models/models';

// GET ALL VEHICLES
export const getVehicles = async (c: any) => {
  try {
    // Filter by status if provided in query params
    const { status } = c.req.query();
    const query: any = {};
    if (status) query.status = status;

    const vehicles = await Vehicle.find(query).sort({ createdAt: -1 });
    return c.json(vehicles);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// GET SINGLE VEHICLE
export const getVehicleById = async (c: any) => {
  try {
    const vehicle = await Vehicle.findById(c.req.param('id'));
    if (!vehicle) return c.json({ error: 'Vehicle not found' }, 404);
    return c.json(vehicle);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// CREATE VEHICLE
export const createVehicle = async (c: any) => {
  try {
    const body = await c.req.json();
    
    // Check unique regNo
    const existing = await Vehicle.findOne({ regNo: body.regNo.toUpperCase() });
    if (existing) return c.json({ error: 'Vehicle Registration Number must be unique' }, 400);

    const vehicle = new Vehicle(body);
    await vehicle.save();
    return c.json(vehicle, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// UPDATE VEHICLE
export const updateVehicle = async (c: any) => {
  try {
    const body = await c.req.json();
    
    // Prevent regNo update to maintain uniqueness integrity easily, or handle it explicitly
    if(body.regNo) {
       const existing = await Vehicle.findOne({ regNo: body.regNo.toUpperCase(), _id: { $ne: c.req.param('id') } });
       if (existing) return c.json({ error: 'Vehicle Registration Number must be unique' }, 400);
    }

    const vehicle = await Vehicle.findByIdAndUpdate(
      c.req.param('id'), 
      { $set: body }, 
      { new: true, runValidators: true }
    );
    
    if (!vehicle) return c.json({ error: 'Vehicle not found' }, 404);
    return c.json(vehicle);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// DELETE VEHICLE
export const deleteVehicle = async (c: any) => {
  try {
    // Optional: Check if vehicle is ON_TRIP or IN_SHOP before deleting? 
    // For hackathon, simple delete is fine.
    const vehicle = await Vehicle.findByIdAndDelete(c.req.param('id'));
    if (!vehicle) return c.json({ error: 'Vehicle not found' }, 404);
    return c.json({ message: 'Vehicle deleted successfully' });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};
