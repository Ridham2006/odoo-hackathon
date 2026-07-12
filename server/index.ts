import { Hono } from 'hono';
import { cors } from 'hono/cors';
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

// CORS - Allow frontend dev server
app.use('/*', cors({
  origin: ['http://localhost:5173', 'http://localhost:4173', 'http://localhost:3000'],
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Handle OPTIONS preflight for all routes explicitly
app.options('/*', (c) => {
  return c.body(null, 204);
});

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
