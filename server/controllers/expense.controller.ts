import { FuelLog, Expense, Maintenance } from '../models/models';

// ==========================================
// FUEL LOGS
// ==========================================

// GET ALL FUEL LOGS
export const getFuelLogs = async (c: any) => {
  try {
    const logs = await FuelLog.find()
      .populate('vehicle', 'regNo name')
      .sort({ date: -1 });
    return c.json(logs);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// ADD FUEL LOG
export const addFuelLog = async (c: any) => {
  try {
    const { vehicle: vehicleId, liters, fuelCost, date } = await c.req.json();
    
    const log = new FuelLog({
      vehicle: vehicleId,
      liters,
      fuelCost,
      date: date || Date.now()
    });

    await log.save();
    return c.json(log, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// ==========================================
// OTHER EXPENSES (Toll, Misc, Maintenance linked)
// ==========================================

// GET ALL EXPENSES
export const getExpenses = async (c: any) => {
  try {
    const expenses = await Expense.find()
      .populate('vehicle', 'regNo name')
      .populate('trip', 'tripNo source destination')
      .sort({ createdAt: -1 });
      
    return c.json(expenses);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// ADD EXPENSE
export const addExpense = async (c: any) => {
  try {
    const { trip, vehicle: vehicleId, toll, other, maintenance: maintenanceId } = await c.req.json();

    let maintenanceCost = 0;
    
    // If linked to a maintenance record, fetch its cost to calculate total
    if (maintenanceId) {
      const maint = await Maintenance.findById(maintenanceId);
      if (maint) maintenanceCost = maint.cost;
    }

    // Calculate Total automatically
    const total = (toll || 0) + (other || 0) + maintenanceCost;

    const expense = new Expense({
      trip: trip || null,
      vehicle: vehicleId,
      toll: toll || 0,
      other: other || 0,
      maintenance: maintenanceId || null,
      total,
      status: 'AVAILABLE' // Default status as per your drawing
    });

    await expense.save();
    return c.json(expense, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};
