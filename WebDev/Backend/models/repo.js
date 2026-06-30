import mongoose, { Schema } from "mongoose";

const RepoSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

RepoSchema.index({ userId: 1 });

RepoSchema.index({ url: 1 });

export const Repo = mongoose.model("Repo", RepoSchema);
