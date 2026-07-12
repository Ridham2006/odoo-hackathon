import { Vehicle, Driver, Trip, FuelLog, Maintenance, Expense } from '../models/models';

// ==========================================
// DASHBOARD KPIs
// ==========================================
export const getDashboardKPIs = async (c: any) => {
  try {
    const [
      totalVehicles,
      activeVehicles,
      availableVehicles,
      inShopVehicles,
      activeTrips,
      pendingTrips,
      driversOnDuty
    ] = await Promise.all([
      Vehicle.countDocuments(),
      Vehicle.countDocuments({ status: 'ON_TRIP' }),
      Vehicle.countDocuments({ status: 'AVAILABLE' }),
      Vehicle.countDocuments({ status: 'IN_SHOP' }),
      Trip.countDocuments({ status: 'DISPATCHED' }),
      Trip.countDocuments({ status: 'DRAFT' }),
      Driver.countDocuments({ status: 'ON_TRIP' })
    ]);

    // Fleet Utilization (%) = (Active Vehicles / Total Vehicles) * 100
    const fleetUtilization = totalVehicles > 0 
      ? Math.round((activeVehicles / totalVehicles) * 100) 
      : 0;

    return c.json({
      totalVehicles,
      activeVehicles,
      availableVehicles,
      inShopVehicles,
      activeTrips,
      pendingTrips,
      driversOnDuty,
      fleetUtilization
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// ==========================================
// ANALYTICS & REPORTS
// ==========================================
export const getAnalytics = async (c: any) => {
  try {
    // 1. Total Fuel Cost & Liters per Vehicle
    const fuelData = await FuelLog.aggregate([
      { $group: { _id: '$vehicle', totalFuelCost: { $sum: '$fuelCost' }, totalLiters: { $sum: '$liters' } } }
    ]);

    // 2. Total Maintenance Cost per Vehicle
    const maintData = await Maintenance.aggregate([
      { $group: { _id: '$vehicle', totalMaintCost: { $sum: '$cost' } } }
    ]);

    // 3. Total Other Expenses (Toll + Misc) per Vehicle
    const expData = await Expense.aggregate([
      { $group: { _id: '$vehicle', totalExpenses: { $sum: '$total' } } }
    ]);

    // 4. Total Distance covered per Vehicle (from completed trips)
    const tripData = await Trip.aggregate([
      { $match: { status: 'COMPLETED' } },
      { $group: { _id: '$vehicle', totalDistance: { $sum: '$plannedDistance' } } }
    ]);

    // Combine all data per vehicle
    const vehicleStatsMap = new Map();

    // Helper to populate map
    const addToMap = (data, key, value) => {
      data.forEach(item => {
        const id = item._id.toString();
        if (!vehicleStatsMap.has(id)) {
          vehicleStatsMap.set(id, { vehicleId: id, fuelCost: 0, maintCost: 0, expenses: 0, totalDistance: 0, totalLiters: 0 });
        }
        vehicleStatsMap.get(id)[key] = item[value];
      });
    };

    addToMap(fuelData, 'fuelCost', 'totalFuelCost');
    addToMap(fuelData, 'totalLiters', 'totalLiters'); // Add liters for efficiency
    addToMap(maintData, 'maintCost', 'totalMaintCost');
    addToMap(expData, 'expenses', 'totalExpenses');
    addToMap(tripData, 'totalDistance', 'totalDistance');

    // Fetch all vehicles to get Acq Cost, Name, Reg No
    const vehicles = await Vehicle.find().select('regNo name acqCost');
    
    const analyticsResult = [];
    let overallOpCost = 0;

    for (const v of vehicles) {
      const stats = vehicleStatsMap.get(v._id.toString()) || { fuelCost: 0, maintCost: 0, expenses: 0, totalDistance: 0, totalLiters: 0 };
      
      const operationalCost = stats.fuelCost + stats.maintCost + stats.expenses;
      overallOpCost += operationalCost;

      // Fuel Efficiency = Distance / Fuel (km/L)
      const fuelEfficiency = stats.totalLiters > 0 ? (stats.totalDistance / stats.totalLiters).toFixed(2) : 0;

      // ROI = (Revenue - (Maint + Fuel)) / Acq Cost
      // Since there is no direct Revenue field in schema, we are assuming Total Expenses as baseline to show logic. 
      // In real world, Revenue would be tracked. Let's calculate a mock ROI based on cost vs acq cost.
      const roi = v.acqCost > 0 ? (((stats.expenses + stats.fuelCost) - (stats.maintCost + v.acqCost)) / v.acqCost * 100).toFixed(2) : 0;

      analyticsResult.push({
        vehicleId: v._id,
        regNo: v.regNo,
        name: v.name,
        fuelEfficiency: parseFloat(String(fuelEfficiency)),
        operationalCost,
        roi: parseFloat(String(roi)),
        acqCost: v.acqCost
      });
    }

    // Sort by operationalCost descending to find Top Costliest Vehicles
    const topCostliestVehicles = [...analyticsResult].sort((a, b) => b.operationalCost - a.operationalCost).slice(0, 5);

    return c.json({
      overallOperationalCost: overallOpCost,
      topCostliestVehicles,
      vehicleDetails: analyticsResult
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// ==========================================
// VEHICLE STATUS DISTRIBUTION
// ==========================================
export const getVehicleStatusDistribution = async (c: any) => {
  try {
    const distribution = await Vehicle.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    return c.json(distribution);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// ==========================================
// TRIP STATUS DISTRIBUTION
// ==========================================
export const getTripStatusDistribution = async (c: any) => {
  try {
    const distribution = await Trip.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    return c.json(distribution);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// ==========================================
// MONTHLY FUEL TREND (last 6 months)
// ==========================================
export const getMonthlyFuelTrend = async (c: any) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const trend = await FuelLog.aggregate([
      { $match: { date: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          totalFuelCost: { $sum: '$fuelCost' },
          totalLiters: { $sum: '$liters' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    return c.json(trend);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// ==========================================
// DRIVER STATUS DISTRIBUTION
// ==========================================
export const getDriverStatusDistribution = async (c: any) => {
  try {
    const distribution = await Driver.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    return c.json(distribution);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// ==========================================
// EXPENSE BREAKDOWN (Fuel vs Toll vs Misc)
// ==========================================
export const getExpenseBreakdown = async (c: any) => {
  try {
    const [fuelTotal, expenseTotal] = await Promise.all([
      FuelLog.aggregate([
        { $group: { _id: null, total: { $sum: '$fuelCost' } } }
      ]),
      Expense.aggregate([
        { $group: { _id: null, totalToll: { $sum: '$toll' }, totalOther: { $sum: '$other' } } }
      ])
    ]);

    return c.json({
      fuelCost: fuelTotal[0]?.total || 0,
      toll: expenseTotal[0]?.totalToll || 0,
      other: expenseTotal[0]?.totalOther || 0,
      total: (fuelTotal[0]?.total || 0) + (expenseTotal[0]?.totalToll || 0) + (expenseTotal[0]?.totalOther || 0)
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};
