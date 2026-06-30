import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Repo } from "../models/repo.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Chat } from "../models/chat.js";
import mongoose, { mongo } from "mongoose";
import axios from "axios";

export const createRepo = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // here clone repo into ai python serviece and also do embedding and after that if everything fine then return response

    const { name, url } = req.body;

    if (
      !name ||
      name.trim() === "" ||
      !url ||
      url.trim() === "" ||
      !url.startsWith("https://github.com/")
    ) {
      throw new ApiError(404, "Name and Url is required");
    }

    const exists = await Repo.findOne({ url });

    if (exists) {
      throw new ApiError(404, "Repo already exists");
    }

    // await axios.get(
    //   `https://api.github.com/repos/${url.replace("https://github.com/", "")}`,
    // );

    const repo = await Repo.create(
      [
        {
          name,
          url,
          userId: req.user._id,
        },
      ],
      {
        session,
      },
    );

    const chat = await Chat.create(
      [
        {
          repoId: repo[0]._id,
          userId: req.user._id,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    const result = await axios.post("http://127.0.0.1:8000/initialize-repo", {
      repo_url: url,
      mongo_id: repo[0]._id,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { repo: repo[0], chat: chat[0] },
          "Repo created successfully",
        ),
      );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    throw new ApiError(
      error.statusCode || 500,
      error.message || "Error while registring error",
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

    const result = await axios.post("http://127.0.0.1:8000/pull-repo", {
      repo_url: repo.url,
      mongo_id: repo._id,
    });

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

    const result = await axios.post("http://127.0.0.1:8000/delete-repo", {
      mongo_id: updated._id,
    });

    return res.status(200).json(new ApiResponse(200, {}, "Repo Deleted"));
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Error while deleting repo",
    );
  }
});
