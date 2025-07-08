import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { connectDB } from "./config/database.js";
import userRoutes from "./routes/users.js";
import marketplaceRoutes from "./routes/marketplace.js";

export function createServer() {
  const app = express();

  // Connect to MongoDB
  connectDB();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // User routes
  app.use("/api/users", userRoutes);

  // Marketplace routes
  app.use("/api/marketplace", marketplaceRoutes);

  return app;
}
