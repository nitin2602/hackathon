import { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Import your existing route handlers
import { handleDemo } from "../server/routes/demo";
import { createUser, getUser, updateUserStats } from "../server/routes/users";
import { getMarketplaceItems } from "../server/routes/marketplace";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }

  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/ecocreds",
    );
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
};

// API Routes
app.get("/api/ping", (req, res) => {
  res.json({ message: "API is running on Vercel!" });
});

app.get("/api/demo", handleDemo);
app.post("/api/users", createUser);
app.get("/api/users/:email", getUser);
app.patch("/api/users/:email/stats", updateUserStats);
app.get("/api/marketplace", getMarketplaceItems);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Vercel serverless function handler
export default async (req: VercelRequest, res: VercelResponse) => {
  await connectDB();
  return app(req, res);
};
