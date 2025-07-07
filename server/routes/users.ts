import express from "express";
import { User } from "../models/User.js";
import { Activity } from "../models/Activity.js";

const router = express.Router();

// Get user by email
router.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create or update user
router.post("/", async (req, res) => {
  try {
    const userData = req.body;

    const user = await User.findOneAndUpdate(
      { email: userData.email },
      userData,
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    res.json(user);
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update user stats
router.patch("/:email/stats", async (req, res) => {
  try {
    const { email } = req.params;
    const updates = req.body;

    const user = await User.findOneAndUpdate(
      { email },
      { $inc: updates },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error updating user stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add activity for user
router.post("/:email/activities", async (req, res) => {
  try {
    const { email } = req.params;
    const activityData = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const activity = new Activity({
      ...activityData,
      userId: user._id,
    });

    await activity.save();
    res.json(activity);
  } catch (error) {
    console.error("Error saving activity:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get user activities
router.get("/:email/activities", async (req, res) => {
  try {
    const { email } = req.params;
    const { limit = 10 } = req.query;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const activities = await Activity.find({ userId: user._id })
      .sort({ timestamp: -1 })
      .limit(Number(limit));

    res.json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
