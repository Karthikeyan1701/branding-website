import mongoose from "mongoose";
import { logger } from "../utils/logger.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    logger.info(
      `MongoDB connected: ${conn.connection.host}/${conn.connection.name}`
    );

    // Connection lifecycle monitoring
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });

  } catch (error) {
    logger.fatal(
      { err: error },
      "MongoDB connection failed:"
    );
    process.exit(1);
  }
};

export default connectDB;