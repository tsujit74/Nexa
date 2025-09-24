// src/models/User.ts
import { Schema, model, Document } from "mongoose";

// Define allowed social platforms
export type Platform = "twitter" | "linkedin" | "instagram";

// Twitter account type for OAuth 1.0a
export interface ITwitterAccount {
  accessToken: string;
  accessSecret: string;
}

// Define SocialAccounts type
export interface ISocialAccounts {
  twitter?: ITwitterAccount;
  linkedin?: string;
  instagram?: string;      
  instagramId?: string;
}

// User interface
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  socialAccounts: ISocialAccounts;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    socialAccounts: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export default model<IUser>("User", UserSchema);
