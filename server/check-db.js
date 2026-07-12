import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

async function checkDB() {
  const uri = process.env.MONGO_URL;
  if (!uri) {
    console.error('❌ MONGO_URL not found in .env');
    process.exit(1);
  }
  
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Successfully connected to MongoDB');
    const db = client.db('transitops');
    const collections = await db.listCollections().toArray();
    console.log('📊 Collections:', collections.map(c => c.name));
    
    const count = await db.collection('drivers').countDocuments();
    console.log('🚗 Existing drivers:', count);
    
    await client.close();
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
  }
}

checkDB();
