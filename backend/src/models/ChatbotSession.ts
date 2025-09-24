import { Schema, model, Document, Types } from "mongoose";

export interface IChatbotSession extends Document {
  userId: Types.ObjectId;
  context: { user: string; ai: string }[];
}

const ChatbotSessionSchema = new Schema<IChatbotSession>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  context: { type: [{ user: String, ai: String }], default: [] },
});

export default model<IChatbotSession>("ChatbotSession", ChatbotSessionSchema);
