import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// ---- Import Schemas (same as models.ts) ----
import {
  User, Vehicle, Driver, Trip, Maintenance, FuelLog, Expense
} from './models/models';

const MONGO_URL = process.env.MONGO_URL;
if (!MONGO_URL) {
  console.error('❌ MONGO_URL not found in .env');
  process.exit(1);
}

async function seed() {
  console.log('🌱 Connecting to MongoDB...');
  await mongoose.connect(MONGO_URL);
  console.log('✅ MongoDB connected!\n');

  // ---- CLEAR EXISTING DATA ----
  console.log('🧹 Clearing existing data...');
  await Promise.all([
    User.deleteMany({}),
    Vehicle.deleteMany({}),
    Driver.deleteMany({}),
    Trip.deleteMany({}),
    Maintenance.deleteMany({}),
    FuelLog.deleteMany({}),
    Expense.deleteMany({}),
  ]);
  console.log('✅ All collections cleared!\n');

  // ---- SEED USERS ----
  console.log('👤 Seeding Users...');
  const hashedPassword = await bcrypt.hash('password123', 10);
  const users = await User.insertMany([
    { name: 'Raven Kapoor',      email: 'admin@transitops.com',    password: hashedPassword, role: 'FLEET_MANAGER' },
    { name: 'Arjun Mehta',       email: 'dispatcher@transitops.com', password: hashedPassword, role: 'DISPATCHER' },
    { name: 'Priya Sharma',      email: 'safety@transitops.com',    password: hashedPassword, role: 'SAFETY_OFFICER' },
    { name: 'Vikram Joshi',      email: 'finance@transitops.com',   password: hashedPassword, role: 'FINANCIAL_ANALYST' },
  ]);
  console.log(`   Created ${users.length} users`);
  console.log('   📧 Login: admin@transitops.com / password123 (Fleet Manager)');
  console.log('   📧 Login: dispatcher@transitops.com / password123 (Dispatcher)');
  console.log('   📧 Login: safety@transitops.com / password123 (Safety Officer)');
  console.log('   📧 Login: finance@transitops.com / password123 (Financial Analyst)\n');

  // ---- SEED VEHICLES ----
  console.log('🚛 Seeding Vehicles...');
  const vehicles = await Vehicle.insertMany([
    { regNo: 'GJ01AB1234', name: 'TATA TRUCK-01', type: 'Truck', capacity: 5000, odometer: 74200, acqCost: 2450000, status: 'ON_TRIP' },
    { regNo: 'GJ01AB5678', name: 'TATA TRUCK-02', type: 'Truck', capacity: 8000, odometer: 123500, acqCost: 3200000, status: 'AVAILABLE' },
    { regNo: 'GJ01CD9012', name: 'ASHOK LEYLAND-01', type: 'Truck', capacity: 12000, odometer: 210000, acqCost: 4100000, status: 'IN_SHOP' },
    { regNo: 'MH02EF3456', name: 'FORCE VAN-01', type: 'Van', capacity: 1500, odometer: 45600, acqCost: 850000, status: 'AVAILABLE' },
    { regNo: 'MH02EF7890', name: 'FORCE VAN-02', type: 'Van', capacity: 1200, odometer: 62300, acqCost: 780000, status: 'ON_TRIP' },
    { regNo: 'DL03GH1234', name: 'MARuti MINI-01', type: 'Mini', capacity: 800, odometer: 38500, acqCost: 520000, status: 'AVAILABLE' },
    { regNo: 'DL03GH5678', name: 'MARuti MINI-02', type: 'Mini', capacity: 1000, odometer: 89400, acqCost: 590000, status: 'RETIRED' },
    { regNo: 'KA04IJ9012', name: 'EICHER BUS-01', type: 'Bus', capacity: 3000, odometer: 156700, acqCost: 2800000, status: 'AVAILABLE' },
    { regNo: 'KA04IJ3456', name: 'EICHER BUS-02', type: 'Bus', capacity: 3500, odometer: 112300, acqCost: 2950000, status: 'IN_SHOP' },
    { regNo: 'TN05KL7890', name: 'TATA TRUCK-03', type: 'Truck', capacity: 10000, odometer: 178900, acqCost: 3800000, status: 'AVAILABLE' },
  ]);
  console.log(`   Created ${vehicles.length} vehicles\n`);

  // ---- SEED DRIVERS ----
  console.log('🧑‍✈️ Seeding Drivers...');
  const today = new Date();
  const nextYear = new Date(today.getFullYear() + 1, 5, 15);
  const lastYear = new Date(today.getFullYear() - 1, 3, 10);
  const drivers = await Driver.insertMany([
    { name: 'Rajesh Patel',    licenseNo: 'GJ01202412345', category: 'Heavy Vehicle', expiry: new Date('2026-08-20'), contact: '+91 98765 43210', tripCompleted: 142, safetyStatus: 'Good',   status: 'ON_TRIP' },
    { name: 'Suresh Reddy',    licenseNo: 'MH02202467890', category: 'Heavy Vehicle', expiry: new Date('2025-12-15'), contact: '+91 87654 32109', tripCompleted: 98,  safetyStatus: 'Good',   status: 'AVAILABLE' },
    { name: 'Amit Singh',      licenseNo: 'DL03202411111', category: 'Medium Vehicle', expiry: new Date('2027-03-10'), contact: '+91 76543 21098', tripCompleted: 56,  safetyStatus: 'Average', status: 'AVAILABLE' },
    { name: 'Deepak Verma',    licenseNo: 'KA04202422222', category: 'Heavy Vehicle', expiry: new Date('2025-06-05'), contact: '+91 65432 10987', tripCompleted: 210, safetyStatus: 'Good',   status: 'ON_TRIP' },
    { name: 'Manoj Tiwari',    licenseNo: 'TN05202433333', category: 'Light Vehicle', expiry: lastYear,                   contact: '+91 54321 09876', tripCompleted: 34,  safetyStatus: 'Poor',   status: 'SUSPENDED' },
    { name: 'Vijay Kumar',     licenseNo: 'GJ06202444444', category: 'Medium Vehicle', expiry: new Date('2026-11-30'), contact: '+91 43210 98765', tripCompleted: 78,  safetyStatus: 'Good',   status: 'AVAILABLE' },
    { name: 'Rohit Sharma',    licenseNo: 'MH07202455555', category: 'Light Vehicle', expiry: nextYear,                    contact: '+91 32109 87654', tripCompleted: 12,  safetyStatus: 'Good',   status: 'OFF_DUTY' },
    { name: 'Sunil Gawande',   licenseNo: 'DL08202466666', category: 'Heavy Vehicle', expiry: new Date('2025-09-18'), contact: '+91 21098 76543', tripCompleted: 167, safetyStatus: 'Average', status: 'AVAILABLE' },
  ]);
  console.log(`   Created ${drivers.length} drivers\n`);

  // ---- SEED TRIPS ----
  console.log('🗺️ Seeding Trips...');
  const tripNo = (i: number) => `TRP-${String(i).padStart(4, '0')}`;
  const trips = await Trip.insertMany([
    { tripNo: tripNo(1), source: 'Ahmedabad', destination: 'Surat',       vehicle: vehicles[0]._id, driver: drivers[0]._id, cargoWeight: 3200, plannedDistance: 260, status: 'DISPATCHED' },
    { tripNo: tripNo(2), source: 'Mumbai',    destination: 'Pune',        vehicle: vehicles[4]._id, driver: drivers[3]._id, cargoWeight: 800,  plannedDistance: 150, status: 'DISPATCHED' },
    { tripNo: tripNo(3), source: 'Delhi',     destination: 'Jaipur',      vehicle: vehicles[5]._id, driver: drivers[2]._id, cargoWeight: 500,  plannedDistance: 280, status: 'COMPLETED' },
    { tripNo: tripNo(4), source: 'Bangalore', destination: 'Chennai',     vehicle: vehicles[7]._id, driver: drivers[5]._id, cargoWeight: 1800, plannedDistance: 340, status: 'COMPLETED' },
    { tripNo: tripNo(5), source: 'Ahmedabad', destination: 'Vadodara',    vehicle: vehicles[1]._id, driver: drivers[1]._id, cargoWeight: 4500, plannedDistance: 110, status: 'DRAFT' },
    { tripNo: tripNo(6), source: 'Surat',     destination: 'Mumbai',      vehicle: vehicles[9]._id, driver: drivers[7]._id, cargoWeight: 6000, plannedDistance: 300, status: 'DRAFT' },
    { tripNo: tripNo(7), source: 'Pune',      destination: 'Hyderabad',   vehicle: vehicles[1]._id, driver: drivers[1]._id, cargoWeight: 5200, plannedDistance: 560, status: 'CANCELLED' },
    { tripNo: tripNo(8), source: 'Delhi',     destination: 'Chandigarh',  vehicle: vehicles[3]._id, driver: drivers[6]._id, cargoWeight: 900,  plannedDistance: 250, status: 'COMPLETED' },
    { tripNo: tripNo(9), source: 'Mumbai',    destination: 'Ahmedabad',   vehicle: vehicles[4]._id, driver: drivers[3]._id, cargoWeight: 1100, plannedDistance: 530, status: 'COMPLETED' },
    { tripNo: tripNo(10), source: 'Chennai',  destination: 'Bangalore',   vehicle: vehicles[7]._id, driver: drivers[5]._id, cargoWeight: 2200, plannedDistance: 350, status: 'DRAFT' },
  ]);
  console.log(`   Created ${trips.length} trips\n`);

  // ---- SEED MAINTENANCE ----
  console.log('🔧 Seeding Maintenance...');
  const maintenance = await Maintenance.insertMany([
    { vehicle: vehicles[2]._id, serviceType: 'Engine Overhaul',     cost: 45000,  date: new Date('2025-12-01'), status: 'OPEN' },
    { vehicle: vehicles[8]._id, serviceType: 'Brake Replacement',    cost: 12000,  date: new Date('2025-11-20'), status: 'OPEN' },
    { vehicle: vehicles[0]._id, serviceType: 'Oil Change',           cost: 5000,   date: new Date('2025-10-15'), status: 'CLOSED' },
    { vehicle: vehicles[4]._id, serviceType: 'Tire Replacement',     cost: 28000,  date: new Date('2025-09-10'), status: 'CLOSED' },
    { vehicle: vehicles[6]._id, serviceType: 'AC Repair',            cost: 8500,   date: new Date('2025-08-05'), status: 'CLOSED' },
    { vehicle: vehicles[1]._id, serviceType: 'Clutch Replacement',   cost: 15000,  date: new Date('2026-01-10'), status: 'OPEN' },
  ]);
  console.log(`   Created ${maintenance.length} maintenance records\n`);

  // ---- SEED FUEL LOGS ----
  console.log('⛽ Seeding Fuel Logs...');
  const fuelLogs = await FuelLog.insertMany([
    { vehicle: vehicles[0]._id, date: new Date('2026-01-05'), liters: 120, fuelCost: 10800 },
    { vehicle: vehicles[0]._id, date: new Date('2026-01-12'), liters: 95,  fuelCost: 8550  },
    { vehicle: vehicles[1]._id, date: new Date('2026-01-07'), liters: 150, fuelCost: 13500 },
    { vehicle: vehicles[4]._id, date: new Date('2026-01-08'), liters: 55,  fuelCost: 4950  },
    { vehicle: vehicles[4]._id, date: new Date('2026-01-15'), liters: 60,  fuelCost: 5400  },
    { vehicle: vehicles[5]._id, date: new Date('2026-01-10'), liters: 35,  fuelCost: 3150  },
    { vehicle: vehicles[7]._id, date: new Date('2026-01-11'), liters: 85,  fuelCost: 7650  },
    { vehicle: vehicles[9]._id, date: new Date('2026-01-14'), liters: 140, fuelCost: 12600 },
    { vehicle: vehicles[3]._id, date: new Date('2025-12-20'), liters: 45,  fuelCost: 4050  },
    { vehicle: vehicles[8]._id, date: new Date('2025-12-18'), liters: 90,  fuelCost: 8100  },
  ]);
  console.log(`   Created ${fuelLogs.length} fuel logs\n`);

  // ---- SEED EXPENSES ----
  console.log('💰 Seeding Expenses...');
  const expenses = await Expense.insertMany([
    { trip: trips[1]._id, vehicle: vehicles[4]._id, toll: 850,  other: 200,  total: 1050, status: 'AVAILABLE' },
    { trip: trips[2]._id, vehicle: vehicles[5]._id, toll: 1200, other: 450,  total: 1650, status: 'AVAILABLE' },
    { trip: trips[3]._id, vehicle: vehicles[7]._id, toll: 950,  other: 300,  total: 1250, status: 'AVAILABLE' },
    { trip: trips[7]._id, vehicle: vehicles[3]._id, toll: 600,  other: 150,  total: 750,  status: 'AVAILABLE' },
    { trip: trips[8]._id, vehicle: vehicles[4]._id, toll: 1500, other: 600,  total: 2100, status: 'AVAILABLE' },
  ]);
  console.log(`   Created ${expenses.length} expense records\n`);

  // ---- SUMMARY ----
  console.log('═══════════════════════════════════════');
  console.log('✅✅✅ SEED COMPLETE! ✅✅✅');
  console.log('═══════════════════════════════════════');
  console.log(`   Users:       ${users.length}`);
  console.log(`   Vehicles:    ${vehicles.length}`);
  console.log(`   Drivers:     ${drivers.length}`);
  console.log(`   Trips:       ${trips.length}`);
  console.log(`   Maintenance: ${maintenance.length}`);
  console.log(`   Fuel Logs:   ${fuelLogs.length}`);
  console.log(`   Expenses:    ${expenses.length}`);
  console.log('');
  console.log('📝 Login Credentials (password for all: password123):');
  console.log('   admin@transitops.com     → Fleet Manager');
  console.log('   dispatcher@transitops.com → Dispatcher');
  console.log('   safety@transitops.com    → Safety Officer');
  console.log('   finance@transitops.com   → Financial Analyst');
  console.log('═══════════════════════════════════════\n');

  await mongoose.disconnect();
  console.log('👋 Disconnected from MongoDB');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
