import { User } from "../models/user.model.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken";

export const VerifyJWt = asyncHandler(async (req, res, next) => {
  req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    await User.findById(decodedToken?._id).select("-password -refreshToken");

    if (!User) {
      throw new ApiError(401, "invalid access token - user not found");
    }
    req.user = User;
    next();
  } catch (error) {
    throw new ApiError(401, "invalid access token - user not found");
  }
});
