import mongoose from "mongoose";
import { logger } from "../utils/logger.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    logger.info(
      `MongoDB connected: ${conn.connection.host}/${conn.connection.name}`
    );
  } catch (error) {
    logger.error(
      { err: error },
      "MongoDB connection failed:"
    );
    process.exit(1);
  }
};

export default connectDB;