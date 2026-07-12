import { Hono } from 'hono';
import { connectDB } from './config/db';
import { authRoutes } from './routes/auth.routes';
import { vehicleRoutes } from './routes/vehicle.routes';
import { driverRoutes } from './routes/driver.routes'; 
import { tripRoutes } from './routes/trip.routes';
import { maintenanceRoutes } from './routes/maintenance.routes';
import { expenseRoutes } from './routes/expense.routes';
import { analyticsRoutes } from './routes/analytics.routes';
import { serve } from '@hono/node-server';
import dotenv from 'dotenv';
dotenv.config();

const app = new Hono();

// Init DB
connectDB();

// Routes
app.route('/api/auth', authRoutes);
app.route('/api/vehicles', vehicleRoutes);
app.route('/api/drivers', driverRoutes);
app.route('/api/trips', tripRoutes);
app.route('/api/maintenance', maintenanceRoutes);
app.route('/api/expenses', expenseRoutes);
app.route('/api/analytics', analyticsRoutes);

// Test Route
app.get('/', (c) => c.json({ message: 'TransitOps API is running 🚀' }));

const port = 3000;
serve({ fetch: app.fetch, port }, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
