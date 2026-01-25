import mongoose from "mongoose";
import dotenv from "dotenv";
import { logger } from "../utils/logger.js";
import Admin from "../models/admin.model.js";

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const existingAdmin = await Admin.findOne({
            email: "admin@example.com",
        });

        if (existingAdmin) {
            logger.warn("Admin already exists");
            process.exit(0);
        }

        await Admin.create({
            name: "Super Admin",
            email: "admin@example.com",
            password: "Admin@123",
            role: "admin",
        });

        logger.info("Admin user created successfully");
        process.exit(0);
    } catch (error) {
        logger.error({ err: error }, "Admin seeding failed");
        process.exit(1);
    }
};

seedAdmin();