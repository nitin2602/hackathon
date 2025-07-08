import express from "express";
import { MarketplaceItem } from "../models/MarketplaceItem.js";
import { User } from "../models/User.js";

const router = express.Router();

// Get all marketplace items
router.get("/", async (req, res) => {
  try {
    const {
      category,
      condition,
      minPrice,
      maxPrice,
      search,
      limit = 20,
    } = req.query;

    let query: any = { status: "available" };

    if (category) query.category = category;
    if (condition) query.condition = condition;
    if (minPrice || maxPrice) {
      query.salePrice = {};
      if (minPrice) query.salePrice.$gte = Number(minPrice);
      if (maxPrice) query.salePrice.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const items = await MarketplaceItem.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json(items);
  } catch (error) {
    console.error("Error fetching marketplace items:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get marketplace items by seller email
router.get("/seller/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const items = await MarketplaceItem.find({ sellerEmail: email }).sort({
      createdAt: -1,
    });

    res.json(items);
  } catch (error) {
    console.error("Error fetching seller items:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create new marketplace item
router.post("/", async (req, res) => {
  try {
    const itemData = req.body;

    // Validate seller exists
    const seller = await User.findOne({ email: itemData.sellerEmail });
    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    const item = new MarketplaceItem({
      ...itemData,
      sellerId: seller._id,
      sellerName: seller.name,
    });

    await item.save();
    res.status(201).json(item);
  } catch (error) {
    console.error("Error creating marketplace item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update marketplace item
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const item = await MarketplaceItem.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json(item);
  } catch (error) {
    console.error("Error updating marketplace item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete marketplace item
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { sellerEmail } = req.query;

    const item = await MarketplaceItem.findById(id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    // Verify seller owns the item
    if (item.sellerEmail !== sellerEmail) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await MarketplaceItem.findByIdAndDelete(id);
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting marketplace item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Increment views for an item
router.patch("/:id/view", async (req, res) => {
  try {
    const { id } = req.params;

    await MarketplaceItem.findByIdAndUpdate(id, { $inc: { views: 1 } });

    res.json({ message: "View count incremented" });
  } catch (error) {
    console.error("Error incrementing views:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
