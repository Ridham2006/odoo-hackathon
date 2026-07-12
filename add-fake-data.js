import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mongodbFile = path.join(__dirname, 'server', 'node_modules', 'mongodb', 'lib', 'mongodb.js');

if (!fs.existsSync(mongodbFile)) {
  console.error('❌ mongodb not found');
  process.exit(1);
}

global.mongodb = require(mongodbFile);

import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URL;
if (!uri) {
  console.error('❌ MONGO_URL not found in .env');
  process.exit(1);
}

const drivers = [
  { name: 'John Smith', licenseNo: 'LIC001', category: 'Truck', expiry: new Date('2025-06-15'), contact: '+1-555-0101', tripCompleted: 45, safetyStatus: 'Good', status: 'AVAILABLE' },
  { name: 'Maria Garcia', licenseNo: 'LIC002', category: 'Van', expiry: new Date('2025-07-20'), contact: '+1-555-0102', tripCompleted: 78, safetyStatus: 'Good', status: 'ON_TRIP' },
  { name: 'Robert Johnson', licenseNo: 'LIC003', category: 'Bus', expiry: new Date('2025-08-10'), contact: '+1-555-0103', tripCompleted: 120, safetyStatus: 'Good', status: 'AVAILABLE' },
  { name: 'Sarah Williams', licenseNo: 'LIC004', category: 'Truck', expiry: new Date('2025-09-05'), contact: '+1-555-0104', tripCompleted: 23, safetyStatus: 'Good', status: 'OFF_DUTY' },
  { name: 'David Brown', licenseNo: 'LIC005', category: 'Scooter', expiry: new Date('2025-05-15'), contact: '+1-555-0105', tripCompleted: 89, safetyStatus: 'Good', status: 'AVAILABLE' },
  { name: 'Lisa Anderson', licenseNo: 'LIC006', category: 'Truck', expiry: new Date('2025-07-30'), contact: '+1-555-0106', tripCompleted: 67, safetyStatus: 'Good', status: 'AVAILABLE' },
  { name: 'Michael Miller', licenseNo: 'LIC007', category: 'Van', expiry: new Date('2025-08-25'), contact: '+1-555-0107', tripCompleted: 92, safetyStatus: 'Good', status: 'SUSPENDED' },
  { name: 'Jennifer Garcia', licenseNo: 'LIC008', category: 'Bus', expiry: new Date('2025-10-15'), contact: '+1-555-0108', tripCompleted: 156, safetyStatus: 'Good', status: 'AVAILABLE' },
  { name: 'William Turner', licenseNo: 'LIC009', category: 'Truck', expiry: new Date('2025-09-20'), contact: '+1-555-0109', tripCompleted: 34, safetyStatus: 'Good', status: 'ON_TRIP' },
  { name: 'Amanda White', licenseNo: 'LIC010', category: 'Van', expiry: new Date('2025-11-05'), contact: '+1-555-0110', tripCompleted: 71, safetyStatus: 'Good', status: 'AVAILABLE' },
  { name: 'Christopher Lee', licenseNo: 'LIC011', category: 'Truck', expiry: new Date('2026-01-10'), contact: '+1-555-0111', tripCompleted: 83, safetyStatus: 'Good', status: 'AVAILABLE' },
  { name: 'Michelle Rodriguez', licenseNo: 'LIC012', category: 'Bus', expiry: new Date('2025-12-30'), contact: '+1-555-0112', tripCompleted: 44, safetyStatus: 'Good', status: 'OFF_DUTY' },
  { name: 'Jason Martinez', licenseNo: 'LIC013', category: 'Truck', expiry: new Date('2026-02-15'), contact: '+1-555-0113', tripCompleted: 95, safetyStatus: 'Good', status: 'AVAILABLE' },
  { name: 'Nicole Smith', licenseNo: 'LIC014', category: 'Van', expiry: new Date('2025-07-12'), contact: '+1-555-0114', tripCompleted: 52, safetyStatus: 'Good', status: 'SUSPENDED' },
  { name: 'Kevin Johnson', licenseNo: 'LIC015', category: 'Bus', expiry: new Date('2026-03-20'), contact: '+1-555-0115', tripCompleted: 68, safetyStatus: 'Good', status: 'AVAILABLE' },
  { name: 'Sandra Phillips', licenseNo: 'LIC016', category: 'Truck', expiry: new Date('2025-04-10'), contact: '+1-555-0116', tripCompleted: 37, safetyStatus: 'Good', status: 'ON_TRIP' },
  { name: 'Ryan Mitchell', licenseNo: 'LIC017', category: 'Van', expiry: new Date('2025-05-22'), contact: '+1-555-0117', tripCompleted: 94, safetyStatus: 'Good', status: 'SUSPENDED' },
  { name: 'Laura Chen', licenseNo: 'LIC018', category: 'Bus', expiry: new Date('2025-06-05'), contact: '+1-555-0118', tripCompleted: 123, safetyStatus: 'Good', status: 'AVAILABLE' },
  { name: 'Carlos Rivera', licenseNo: 'LIC019', category: 'Truck', expiry: new Date('2026-07-30'), contact: '+1-555-0119', tripCompleted: 201, safetyStatus: 'Good', status: 'ON_TRIP' },
  { name: 'Emily Watson', licenseNo: 'LIC020', category: 'Van', expiry: new Date('2025-08-18'), contact: '+1-555-0120', tripCompleted: 56, safetyStatus: 'Good', status: 'OFF_DUTY' },
  { name: 'Tyler Brooks', licenseNo: 'LIC021', category: 'Scooter', expiry: new Date('2025-09-12'), contact: '+1-555-0121', tripCompleted: 15, safetyStatus: 'Good', status: 'AVAILABLE' },
  { name: 'Rachel Adams', licenseNo: 'LIC022', category: 'Truck', expiry: new Date('2026-10-25'), contact: '+1-555-0122', tripCompleted: 87, safetyStatus: 'Excellent', status: 'AVAILABLE' },
  { name: 'Jason Parker', licenseNo: 'LIC023', category: 'Bus', expiry: new Date('2025-11-03'), contact: '+1-555-0123', tripCompleted: 142, safetyStatus: 'Good', status: 'ON_TRIP' },
  { name: 'Megan Collins', licenseNo: 'LIC024', category: 'Van', expiry: new Date('2026-01-15'), contact: '+1-555-0124', tripCompleted: 98, safetyStatus: 'Good', status: 'AVAILABLE' },
  { name: 'Nathan Bennett', licenseNo: 'LIC025', category: 'Truck', expiry: new Date('2025-02-28'), contact: '+1-555-0125', tripCompleted: 45, safetyStatus: 'Good', status: 'SUSPENDED' },
  { name: 'Sophie Martinez', licenseNo: 'LIC026', category: 'Bus', expiry: new Date('2025-03-17'), contact: '+1-555-0126', tripCompleted: 176, safetyStatus: 'Good', status: 'AVAILABLE' },
  { name: 'Derek Lewis', licenseNo: 'LIC027', category: 'Van', expiry: new Date('2026-04-09'), contact: '+1-555-0127', tripCompleted: 129, safetyStatus: 'Good', status: 'ON_TRIP' },
  { name: 'Hannah Clark', licenseNo: 'LIC028', category: 'Truck', expiry: new Date('2025-05-21'), contact: '+1-555-0128', tripCompleted: 62, safetyStatus: 'Good', status: 'AVAILABLE' },
  { name: 'Thomas Rodriguez', licenseNo: 'LIC029', category: 'Bus', expiry: new Date('2026-06-14'), contact: '+1-555-0129', tripCompleted: 184, safetyStatus: 'Good', status: 'AVAILABLE' },
  { name: 'Olivia Scott', licenseNo: 'LIC030', category: 'Van', expiry: new Date('2025-07-08'), contact: '+1-555-0130', tripCompleted: 111, safetyStatus: 'Good', status: 'OFF_DUTY' },
  { name: 'Benjamin Stewart', licenseNo: 'LIC031', category: 'Truck', expiry: new Date('2026-08-16'), contact: '+1-555-0131', tripCompleted: 97, safetyStatus: 'Good', status: 'AVAILABLE' },
  { name: 'Ava Turner', licenseNo: 'LIC032', category: 'Bus', expiry: new Date('2025-09-29'), contact: '+1-555-0132', tripCompleted: 165, safetyStatus: 'Good', status: 'SUSPENDED' },
  { name: 'Samuel Carter', licenseNo: 'LIC033', category: 'Scooter', expiry: new Date('2026-10-12'), contact: '+1-555-0133', tripCompleted: 27, safetyStatus: 'Good', status: 'AVAILABLE' },
  { name: 'Brian Clark', licenseNo: 'LIC034', category: 'Bus', expiry: new Date('2025-06-30'), contact: '+1-555-0134', tripCompleted: 112, safetyStatus: 'Good', status: 'AVAILABLE' }
];

async function seedDatabase() {
  try {
    const MongoClient = global.mongodb.MongoClient;
    const client = new MongoClient(uri);
    await client.connect();
    console.log('✅ MongoDB Connected!');
    
    const db = client.db('transitops');
    
    // Clear existing drivers
    const collection = db.collection('drivers');
    await collection.deleteMany({});
    console.log('🗑️  Cleared existing drivers');
    
    // Insert fake drivers
    const insertedDrivers = await collection.insertMany(drivers);
    console.log(`✅ Successfully added ${insertedDrivers.length} fake drivers to the database`);
    
    insertedDrivers.forEach((driver, index) => {
      console.log(`${index + 1}. ${driver.name} - ${driver.licenseNo} - ${driver.status}`);
    });
    
    await client.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
EOF