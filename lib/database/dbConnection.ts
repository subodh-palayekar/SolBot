import mongoose from 'mongoose';

type connectionObject = {
  isConnected?: Number;
};

const connection: connectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log('already connected to db');
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || '');
    connection.isConnected = db.connections[0].readyState;
    console.log('DB Connected Successfully');
  } catch (error) {
    console.log('Failed to connect to db', error);
    process.exit(1);
  }
}

export default dbConnect;
