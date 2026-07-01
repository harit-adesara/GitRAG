import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Repo } from "../models/repo.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Chat } from "../models/chat.js";
import mongoose, { mongo } from "mongoose";
import axios from "axios";

export const createRepo = asyncHandler(async (req, res) => {
  const { name, url } = req.body;

  if (!name || !url || !url.startsWith("https://github.com/")) {
    throw new ApiError(400, "Name and valid URL required");
  }

  const session = await mongoose.startSession();
  let repo,
    chat,
    isRevived = false;

  // ── PHASE 1: MongoDB transaction ──────────────────────────────
  try {
    session.startTransaction();

    repo = await Repo.findOne({ url, userId: req.user._id }).session(session);

    if (repo) {
      if (repo.isDeleted) {
        repo.isDeleted = false;
        repo.name = name;
        await repo.save({ session });
        isRevived = true;
      }
      // repo exists and is active — nothing to do
    } else {
      const repoArr = await Repo.create(
        [{ name, url, userId: req.user._id, isDeleted: false }],
        { session },
      );
      repo = repoArr[0];

      const chatArr = await Chat.create(
        [{ repoId: repo._id, userId: req.user._id }],
        { session },
      );
      chat = chatArr[0];
    }

    await session.commitTransaction();
  } catch (error) {
    // safe to abort — we never committed
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    throw new ApiError(
      error.statusCode || 500,
      error.message || "DB error creating repo",
    );
  } finally {
    // always runs, always once
    session.endSession();
  }

  // ── PHASE 2: FastAPI call (outside transaction) ───────────────
  try {
    await axios.post(`https://gitrag-1.onrender.com/initialize-repo`, {
      repo_url: url,
      mongo_id: repo._id.toString(),
    });
  } catch (error) {
    // log real FastAPI error
    console.error("FastAPI /initialize-repo failed:");
    console.error("Status:", error.response?.status);
    console.error("Detail:", error.response?.data);

    // manually undo the committed DB write
    try {
      if (chat) {
        await Chat.findByIdAndDelete(chat._id);
        await Repo.findByIdAndDelete(repo._id);
      } else if (isRevived) {
        repo.isDeleted = true;
        await repo.save();
      }
    } catch (rollbackError) {
      // rollback failed — log it so you can clean up manually
      console.error("Manual rollback failed:", rollbackError.message);
    }

    throw new ApiError(
      502,
      error.response?.data?.detail ||
        `Indexing service error: ${error.message}`,
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { repo, chat: chat || null },
        isRevived ? "Repo revived" : "Repo created",
      ),
    );
});

export const getRepos = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const repos = await Repo.find({ userId, isDeleted: false });

    return res
      .status(200)
      .json(new ApiResponse(200, { repos }, "Repos fetched"));
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Error while getting repos",
    );
  }
});

export const createChat = asyncHandler(async (req, res) => {
  try {
    const { repoId } = req.query;

    if (!repoId || repoId.trim() === "") {
      throw new ApiError(404, "Repo ID is required");
    }

    const repo = await Repo.findById(repoId);

    if (repo.isDeleted === true) {
      throw new ApiError(404, "Repo not exists");
    }

    const chat = await Chat.create({
      repoId,
      userId: req.user._id,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, { chat }, "New Chat created"));
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Error while creating new chat",
    );
  }
});

export const getChats = asyncHandler(async (req, res) => {
  try {
    const { repoId } = req.query;

    if (!repoId || repoId.trim() === "") {
      throw new ApiError(404, "Repo ID is required");
    }

    const repo = await Repo.findById(repoId);

    if (repo.isDeleted === true) {
      throw new ApiError(404, "Repo not exists");
    }

    const chats = await Chat.find({ repoId }).sort({ createdAt: -1 });

    return res
      .status(200)
      .json(new ApiResponse(200, { chats }, "Chat fetched"));
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Error while creating new chat",
    );
  }
});

export const reclone = asyncHandler(async (req, res) => {
  try {
    const { repoId } = req.query;

    if (!repoId) {
      throw new ApiError(404, "Repo Id is required");
    }

    const repo = await Repo.findById(repoId);

    if (!repo) {
      throw new ApiError(404, "Repo not found");
    }

    // await axios.get(
    //   `https://api.github.com/repos/${repo.url.replace("https://github.com/", "")}`,
    // );

    console.log("start reclone");

    const result = await axios.post("https://gitrag-1.onrender.com/pull-repo", {
      repo_url: repo.url,
      mongo_id: repo._id.toString(),
    });

    console.log("end reclone");

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Pulled successfully"));
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Error while pulling repo",
    );
  }
});

export const deleteRepo = asyncHandler(async (req, res) => {
  try {
    const { repoId } = req.query;

    if (!repoId || repoId.trim() === "") {
      throw new ApiError(404, "Repo ID not found");
    }

    const updated = await Repo.findById(repoId);

    if (!updated) {
      throw new ApiError(404, "Repo not found");
    }

    if (updated.isDeleted) {
      throw new ApiError(404, "Repo is already deleted");
    }

    console.log("start delete");

    const result = await axios.post(
      "https://gitrag-1.onrender.com/delete-repo",
      {
        mongo_id: updated._id.toString(),
      },
    );

    console.log("end delete");

    updated.isDeleted = true;
    await updated.save({ validateBeforeSave: true });

    return res.status(200).json(new ApiResponse(200, {}, "Repo Deleted"));
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Error while deleting repo",
    );
  }
});
