import mongoose, { Schema } from "mongoose";

const ChatSchema = new Schema(
  {
    repoId: {
      type: mongoose.Schema.ObjectId,
      ref: "Repo",
      required: true,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      default: "New Chat",
    },
  },
  {
    timestamps: true,
  },
);

ChatSchema.index({ repoId: 1, userId: 1 });
ChatSchema.index({ userId: 1 });
ChatSchema.index({ repoId: 1 });

const Chat = mongoose.model("Chat", ChatSchema);
export { Chat };
