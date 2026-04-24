import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    console.log("MONGO_URI:", process.env.MONGO_URI ? "FOUND" : "MISSING");

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};
