import mongoose from "mongoose";
import { logError } from "../utils/log";

async function dbConnect(): Promise<void> {
  if (mongoose.connections[0].readyState) return;

  await mongoose
    .connect(process.env.MONGODB_DATABASE_URL as string, {
      socketTimeoutMS: 360000,
      dbName: process.env.MONGODB_DATABASE_NAME,
    })
    .catch((error) => {
      logError("Unable to connect to database.", error);
      throw error;
    });
}

export default dbConnect;
