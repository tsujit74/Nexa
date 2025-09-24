import { Schema, model, Document, Types } from "mongoose";

export interface IPost extends Document {
  userId: Types.ObjectId;
  content: string;
  type: "dynamic" | "static";
  scheduledDate: Date;
  status: "pending" | "posted" | "failed";
  platform: "twitter" | "linkedin" | "instagram" | "all";
}

const PostSchema = new Schema<IPost>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ["dynamic", "static"], default: "static" },
  scheduledDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ["pending", "posted", "failed"],
    default: "pending",
  },
  platform: {
    type: String,
    enum: ["twitter", "linkedin", "instagram", "all"],
    default: "all",
  },
});

export default model<IPost>("Post", PostSchema);
