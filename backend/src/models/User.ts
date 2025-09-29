// models/User.ts
import { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";
import { IPost } from "./Post";

export type Platform = "twitter" | "linkedin" | "instagram";

export interface ITwitterAccount {
  accessToken: string;
  accessSecret: string;
}

export interface ILinkedinAccount {
  accessToken: string;
  linkedInId: string;
  name?: string;
  email?: string;
  photo?: string;
  expiresAt?: Date;
}

export interface IInstagramAccount {
  accessToken: string;
  instagramBusinessId?: string;
}

export interface ISocialAccounts {
  instagramBusinessId(post: Document<unknown, {}, IPost, {}, {}> & IPost & Required<{ _id: unknown; }> & { __v: number; }, instagram: IInstagramAccount, instagramBusinessId: any): unknown;
  twitterTemp: any;
  twitter?: ITwitterAccount;
  linkedin?: ILinkedinAccount;
  instagram?: IInstagramAccount;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  socialAccounts: ISocialAccounts;
  comparePassword(candidatePassword: string): Promise<boolean>;
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

// Pre-save hook to hash password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default model<IUser>("User", UserSchema);
