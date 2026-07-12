import { Trip, Vehicle, Driver } from '../models/models';
import { TRIP_STATUS, VEHICLE_STATUS, DRIVER_STATUS } from '../models/models';

// Helper function to generate simple unique Trip Number
const generateTripNo = () => `TRP-${Date.now().toString().slice(-6)}`;

// GET ALL TRIPS
export const getTrips = async (c: any) => {
  try {
    const { status } = c.req.query();
    const query: any = {};
    if (status) query.status = status;

    // Populate vehicle and driver details so frontend can show names
    const trips = await Trip.find(query)
      .populate('vehicle', 'regNo name type')
      .populate('driver', 'name licenseNo status')
      .sort({ createdAt: -1 });
      
    return c.json(trips);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// GET SINGLE TRIP
export const getTripById = async (c: any) => {
  try {
    const trip = await Trip.findById(c.req.param('id'))
      .populate('vehicle')
      .populate('driver');
      
    if (!trip) return c.json({ error: 'Trip not found' }, 404);
    return c.json(trip);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// CREATE TRIP (Draft state)
export const createTrip = async (c: any) => {
  try {
    const { vehicle: vehicleId, driver: driverId, cargoWeight, source, destination, plannedDistance } = await c.req.json();

    // 1. Validate Vehicle
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return c.json({ error: 'Vehicle not found' }, 404);
    if (vehicle.status !== 'AVAILABLE') {
      return c.json({ error: `Vehicle is currently ${vehicle.status} and cannot be assigned.` }, 400);
    }

    // 2. Validate Driver
    const driver = await Driver.findById(driverId);
    if (!driver) return c.json({ error: 'Driver not found' }, 404);
    if (driver.status !== 'AVAILABLE') {
      return c.json({ error: `Driver is currently ${driver.status} and cannot be assigned.` }, 400);
    }
    
    // 3. Validate License Expiry
    if (new Date(driver.expiry) < new Date()) {
      return c.json({ error: 'Driver license has expired. Cannot assign to trip.' }, 400);
    }

    // 4. Validate Cargo Weight
    if (cargoWeight > vehicle.capacity) {
      return c.json({ error: `Cargo weight (${cargoWeight}kg) exceeds vehicle capacity (${vehicle.capacity}kg).` }, 400);
    }

    // Create Trip (Status: DRAFT)
    const trip = new Trip({
      tripNo: generateTripNo(),
      source,
      destination,
      vehicle: vehicleId,
      driver: driverId,
      cargoWeight,
      plannedDistance,
      status: 'DRAFT'
    });

    await trip.save();
    return c.json(trip, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// DISPATCH TRIP (Draft -> Dispatched)
export const dispatchTrip = async (c: any) => {
  try {
    const trip = await Trip.findById(c.req.param('id'));
    if (!trip) return c.json({ error: 'Trip not found' }, 404);
    
    if (trip.status !== 'DRAFT') {
      return c.json({ error: `Trip cannot be dispatched. Current status: ${trip.status}` }, 400);
    }

    // Double check vehicle & driver availability before dispatching
    const vehicle = await Vehicle.findById(trip.vehicle);
    const driver = await Driver.findById(trip.driver);
    
    if (vehicle?.status !== 'AVAILABLE' || driver?.status !== 'AVAILABLE') {
      return c.json({ error: 'Vehicle or Driver is no longer available.' }, 400);
    }

    // Update Trip Status
    trip.status = 'DISPATCHED';
    await trip.save();

    // Auto Update Vehicle & Driver Status to ON_TRIP
    await Vehicle.findByIdAndUpdate(trip.vehicle, { status: 'ON_TRIP' });
    await Driver.findByIdAndUpdate(trip.driver, { status: 'ON_TRIP' });

    return c.json({ message: 'Trip dispatched successfully', trip });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// COMPLETE TRIP (Dispatched -> Completed)
export const completeTrip = async (c: any) => {
  try {
    const trip = await Trip.findById(c.req.param('id'));
    if (!trip) return c.json({ error: 'Trip not found' }, 404);

    if (trip.status !== 'DISPATCHED') {
      return c.json({ error: `Trip cannot be completed. Current status: ${trip.status}` }, 400);
    }

    // Update Trip Status
    trip.status = 'COMPLETED';
    await trip.save();

    // Auto Update Vehicle & Driver Status back to AVAILABLE
    await Vehicle.findByIdAndUpdate(trip.vehicle, { status: 'AVAILABLE' });
    await Driver.findByIdAndUpdate(trip.driver, { status: 'AVAILABLE' });

    return c.json({ message: 'Trip completed successfully', trip });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// CANCEL TRIP (Draft/Dispatched -> Cancelled)
export const cancelTrip = async (c: any) => {
  try {
    const trip = await Trip.findById(c.req.param('id'));
    if (!trip) return c.json({ error: 'Trip not found' }, 404);

    if (trip.status === 'COMPLETED' || trip.status === 'CANCELLED') {
      return c.json({ error: `Trip cannot be cancelled. Current status: ${trip.status}` }, 400);
    }

    // If trip was dispatched, release vehicle and driver
    if (trip.status === 'DISPATCHED') {
      await Vehicle.findByIdAndUpdate(trip.vehicle, { status: 'AVAILABLE' });
      await Driver.findByIdAndUpdate(trip.driver, { status: 'AVAILABLE' });
    }

    // Update Trip Status
    trip.status = 'CANCELLED';
    await trip.save();

    return c.json({ message: 'Trip cancelled successfully', trip });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};
