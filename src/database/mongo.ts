import mongoose from "mongoose";

export async function connectMongo(dbURL: string) {
  try {
    mongoose.set("strictQuery", false);

    await mongoose.connect(dbURL, {
      autoIndex: true,
    });

    console.log("[INFO] MongoDB connected");
  } catch (error) {
    console.error("[FAIL] MongoDB connection error:", error);
    process.exit(1);
  }
}
