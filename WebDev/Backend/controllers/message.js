import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Repo } from "../models/repo.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Chat } from "../models/chat.js";
import { Message } from "../models/message.js";
import mongoose from "mongoose";
import axios from "axios";

export const sendMsg = asyncHandler(async (req, res) => {
  try {
    const { content, chatId, repoId } = req.body;

    if (!content?.trim()) {
      throw new ApiError(400, "Content is required");
    }

    const history = await Message.find({ chatId })
      .sort({ createdAt: 1 })
      .limit(10)
      .select("role content");

    // call Python RAG service
    const result = await axios.post("http://127.0.0.1:8000/message", {
      mongo_id: repoId,
      query: content,
      history: history,
    });

    // save BOTH messages properly
    const userMsg = await Message.create({
      userId: req.user._id,
      chatId,
      role: "user",
      content,
    });

    const aiMsg = await Message.create({
      userId: req.user._id,
      chatId,
      role: "ai",
      content: result.data.results,
    });

    return res.status(200).json(
      new ApiResponse(200, {
        response: result.data.results,
      }),
    );
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Error while sending message",
    );
  }
});

export const chatData = asyncHandler(async (req, res) => {
  try {
    const { chatId } = req.query;

    const messages = await Message.find({ chatId }).sort({ createdAt: 1 });

    return res
      .status(200)
      .json(new ApiResponse(200, { messages }, "Messages are fetched"));
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Error while fetching messages",
    );
  }
});
