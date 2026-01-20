import mongoose from 'mongoose';

const connectDB = async () => {
  const MAX_RETRIES = 5;
  let retries = 0;

  const tryConnect = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
      });
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      retries++;
      console.error(`❌ MongoDB Connection Attempt ${retries}/${MAX_RETRIES} Failed: ${error.message}`);
      
      if (retries < MAX_RETRIES) {
        console.log(`   Retrying in 5 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 5000));
        return tryConnect();
      } else {
        console.error('==========================================');
        console.error('  MONGODB CONNECTION FAILED AFTER ALL RETRIES');
        console.error('  Common fixes:');
        console.error('  1. Whitelist your IP at: https://cloud.mongodb.com');
        console.error('     → Network Access → Add IP Address → Allow Access from Anywhere');
        console.error('  2. Check your MONGO_URI in .env');
        console.error('  3. Check if your Atlas cluster is paused/sleeping');
        console.error('==========================================');
        // Server stays running — API calls will fail with clear error messages
      }
    }
  };

  await tryConnect();
};

export default connectDB;
