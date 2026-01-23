import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "../models/admin.model.js";

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const existingAdmin = await Admin.findOne({
            email: "admin@example.com",
        });

        if (existingAdmin) {
            console.log("Admin already exists");
            process.exit(0);
        }

        await Admin.create({
            name: "Super Admin",
            email: "admin@example.com",
            password: "Admin@123",
            role: "admin",
        });

        console.log("Admin user created successfully");
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedAdmin();