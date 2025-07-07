import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  ecoCredits: number;
  co2SavedThisMonth: number;
  co2SavedTotal: number;
  purchasesCount: number;
  level: string;
  progressToNext: number;
  badgesEarned: string[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    ecoCredits: {
      type: Number,
      default: 0,
    },
    co2SavedThisMonth: {
      type: Number,
      default: 0,
    },
    co2SavedTotal: {
      type: Number,
      default: 0,
    },
    purchasesCount: {
      type: Number,
      default: 0,
    },
    level: {
      type: String,
      default: "Eco Starter",
    },
    progressToNext: {
      type: Number,
      default: 0,
    },
    badgesEarned: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model<IUser>("User", userSchema);
