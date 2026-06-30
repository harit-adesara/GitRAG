import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Repo } from "../models/repo.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Chat } from "../models/chat.js";
import mongoose, { mongo } from "mongoose";
import axios from "axios";

export const createRepo = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { name, url } = req.body;

    if (!name || !url || !url.startsWith("https://github.com/")) {
      throw new ApiError(400, "Name and valid URL required");
    }

    let repo = await Repo.findOne({
      url,
      userId: req.user._id,
    }).session(session);

    let chat;

    // CASE 1: Repo exists
    if (repo) {
      // revive if deleted
      if (repo.isDeleted) {
        repo.isDeleted = false;
        repo.name = name;
        await repo.save({ session });
      }
    } else {
      // CASE 2: new repo
      repo = await Repo.create(
        [
          {
            name,
            url,
            userId: req.user._id,
            isDeleted: false,
          },
        ],
        { session },
      );

      repo = repo[0];

      chat = await Chat.create(
        [
          {
            repoId: repo._id,
            userId: req.user._id,
          },
        ],
        { session },
      );

      chat = chat[0];
    }

    await session.commitTransaction();
    session.endSession();

    // IMPORTANT: call fastapi AFTER commit
    console.log("start create");
    await axios.post("https://gitrag-1.onrender.com/initialize-repo", {
      repo_url: url,
      mongo_id: repo._id,
    });
    console.log("end create");

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          repo,
          chat: chat || null,
        },
        repo.isDeleted ? "Repo revived" : "Repo created",
      ),
    );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    throw new ApiError(
      error.statusCode || 500,
      error.message || "Error creating repo",
    );
  }
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
      mongo_id: repo._id,
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

    updated.isDeleted = true;
    await updated.save({ validateBeforeSave: true });

    console.log("start delete");

    const result = await axios.post(
      "https://gitrag-1.onrender.com/delete-repo",
      {
        mongo_id: updated._id,
      },
    );

    console.log("end delete");

    return res.status(200).json(new ApiResponse(200, {}, "Repo Deleted"));
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Error while deleting repo",
    );
  }
});
