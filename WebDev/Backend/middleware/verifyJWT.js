import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized user");
    }

    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decodeToken) {
      throw new ApiError(401, "Error while decoding");
    }

    const user = await User.findById(decodeToken._id).select(
      "-refreshToken -emailVerificationToken -emailVerificationExpiry -password -forgetPasswordToken -forgetPasswordExpiry",
    );

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    throw new ApiError(401, "Unauthorized user");
  }
});
