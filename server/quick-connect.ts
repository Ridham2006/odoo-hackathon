import mongoose from 'mongoose';
import { connectDB } from './config/db';

connectDB()
  .then(() => console.log('✅ Connected'))
  .catch(err => console.log('❌ Error:', err));
