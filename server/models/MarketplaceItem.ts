import mongoose, { Document, Schema } from "mongoose";

export interface IMarketplaceItem extends Document {
  sellerId: mongoose.Types.ObjectId;
  sellerName: string;
  sellerEmail: string;
  name: string;
  category: string;
  condition: "excellent" | "good" | "fair" | "poor";
  description: string;
  originalPrice: number;
  salePrice: number;
  discountPercentage: number;
  ecoScore: number;
  images: string[];
  status: "available" | "sold" | "removed";
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const marketplaceItemSchema = new Schema<IMarketplaceItem>(
  {
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sellerName: {
      type: String,
      required: true,
    },
    sellerEmail: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Electronics", "Clothing", "Home", "Books", "Sports", "Other"],
    },
    condition: {
      type: String,
      required: true,
      enum: ["excellent", "good", "fair", "poor"],
    },
    description: {
      type: String,
      required: true,
    },
    originalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    salePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPercentage: {
      type: Number,
      min: 0,
      max: 100,
    },
    ecoScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 85, // High eco score for second-hand items
    },
    images: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ["available", "sold", "removed"],
      default: "available",
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Calculate discount percentage before saving
marketplaceItemSchema.pre("save", function (next) {
  if (this.originalPrice && this.salePrice) {
    this.discountPercentage = Math.round(
      ((this.originalPrice - this.salePrice) / this.originalPrice) * 100,
    );
  }
  next();
});

export const MarketplaceItem = mongoose.model<IMarketplaceItem>(
  "MarketplaceItem",
  marketplaceItemSchema,
);
