import mongoose, { Document, Schema } from "mongoose";

export interface IActivity extends Document {
  userId: mongoose.Types.ObjectId;
  action: string;
  item: string;
  co2Saved?: number;
  ecoCredits: number;
  timestamp: number;
  type: "purchase" | "recycle" | "offset" | "reward" | "badge";
  createdAt: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    item: {
      type: String,
      required: true,
    },
    co2Saved: {
      type: Number,
      default: 0,
    },
    ecoCredits: {
      type: Number,
      required: true,
    },
    timestamp: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["purchase", "recycle", "offset", "reward", "badge"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Activity = mongoose.model<IActivity>("Activity", activitySchema);
