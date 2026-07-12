import mongoose, { Document, Schema, model } from 'mongoose';

// --- ENUMS ---
export const ROLES = ['FLEET_MANAGER', 'DISPATCHER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'] as const;
export const VEHICLE_STATUS = ['AVAILABLE', 'ON_TRIP', 'IN_SHOP', 'RETIRED'] as const;
export const DRIVER_STATUS = ['AVAILABLE', 'ON_TRIP', 'OFF_DUTY', 'SUSPENDED'] as const;
export const TRIP_STATUS = ['DRAFT', 'DISPATCHED', 'COMPLETED', 'CANCELLED'] as const;

// --- INTERFACES ---
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: typeof ROLES[number];
}

export interface IVehicle extends Document {
  regNo: string;
  name: string;
  type: string;
  capacity: number;
  odometer: number;
  acqCost: number;
  status: typeof VEHICLE_STATUS[number];
}

export interface IDriver extends Document {
  name: string;
  licenseNo: string;
  category: string;
  expiry: Date;
  contact: string;
  tripCompleted: number;
  safetyStatus: string;
  status: typeof DRIVER_STATUS[number];
}

export interface ITrip extends Document {
  tripNo: string;
  source: string;
  destination: string;
  vehicle: mongoose.Types.ObjectId;
  driver: mongoose.Types.ObjectId;
  cargoWeight: number;
  plannedDistance: number;
  status: typeof TRIP_STATUS[number];
}

export interface IMaintenance extends Document {
  vehicle: mongoose.Types.ObjectId;
  serviceType: string;
  cost: number;
  date: Date;
  status: 'OPEN' | 'CLOSED';
}

export interface IFuelLog extends Document {
  vehicle: mongoose.Types.ObjectId;
  date: Date;
  liters: number;
  fuelCost: number;
}

export interface IExpense extends Document {
  trip: mongoose.Types.ObjectId;
  vehicle: mongoose.Types.ObjectId;
  toll: number;
  other: number;
  maintenance: mongoose.Types.ObjectId;
  total: number;
  status: string;
}

// --- SCHEMAS ---
const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ROLES, required: true }
}, { timestamps: true });

const vehicleSchema = new Schema<IVehicle>({
  regNo: { type: String, required: true, unique: true, uppercase: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  capacity: { type: Number, required: true },
  odometer: { type: Number, default: 0 },
  acqCost: { type: Number, required: true },
  status: { type: String, enum: VEHICLE_STATUS, default: 'AVAILABLE' }
}, { timestamps: true });

const driverSchema = new Schema<IDriver>({
  name: { type: String, required: true },
  licenseNo: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  expiry: { type: Date, required: true },
  contact: { type: String, required: true },
  tripCompleted: { type: Number, default: 0 },
  safetyStatus: { type: String, default: 'Good' },
  status: { type: String, enum: DRIVER_STATUS, default: 'AVAILABLE' }
}, { timestamps: true });

const tripSchema = new Schema<ITrip>({
  tripNo: { type: String, required: true, unique: true },
  source: { type: String, required: true },
  destination: { type: String, required: true },
  vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  driver: { type: Schema.Types.ObjectId, ref: 'Driver', required: true },
  cargoWeight: { type: Number, required: true },
  plannedDistance: { type: Number, required: true },
  status: { type: String, enum: TRIP_STATUS, default: 'DRAFT' }
}, { timestamps: true });

const maintenanceSchema = new Schema<IMaintenance>({
  vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  serviceType: { type: String, required: true },
  cost: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['OPEN', 'CLOSED'], default: 'OPEN' }
}, { timestamps: true });

const fuelLogSchema = new Schema<IFuelLog>({
  vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  date: { type: Date, default: Date.now },
  liters: { type: Number, required: true },
  fuelCost: { type: Number, required: true }
}, { timestamps: true });

const expenseSchema = new Schema<IExpense>({
  trip: { type: Schema.Types.ObjectId, ref: 'Trip' },
  vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  toll: { type: Number, default: 0 },
  other: { type: Number, default: 0 },
  maintenance: { type: Schema.Types.ObjectId, ref: 'Maintenance' },
  total: { type: Number, default: 0 },
  status: { type: String, default: 'AVAILABLE' }
}, { timestamps: true });

// --- EXPORT MODELS ---
export const User = model<IUser>('User', userSchema);
export const Vehicle = model<IVehicle>('Vehicle', vehicleSchema);
export const Driver = model<IDriver>('Driver', driverSchema);
export const Trip = model<ITrip>('Trip', tripSchema);
export const Maintenance = model<IMaintenance>('Maintenance', maintenanceSchema);
export const FuelLog = model<IFuelLog>('FuelLog', fuelLogSchema);
export const Expense = model<IExpense>('Expense', expenseSchema);
