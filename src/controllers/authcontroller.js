/* import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/apiresponse.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { sendmail, emailVerificationContent } from "../utils/mail.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken(); // Corrected typo
    const refreshToken = user.generatingRefreshToken(); // Corrected typo

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken }; // Corrected typo
  } catch (error) {
    throw new ApiError(500, "something went wrong while generating token");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, role } = req.body;

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new ApiError(409, "user already exist");
  }

  const user = await User.create({
    username,
    email,
    password,
    isEmailVerified: false,
  });

  const { unHashed, hashedToken, TokenExpiry } = user.generateTemporaryToken();

  user.emailVarificationTOken = hashedToken; // Corrected typo
  user.emailVarificationExpiry = TokenExpiry; // Corrected typo
  await user.save({ validateBeforeSave: false });
  // send verification email

  await sendmail({
    email: user.email,
    subject: "verify your email",
    // Corrected property name from mailgencontent
    emailVerificationContent: emailVerificationContent(
      user.username,
      // Corrected req.$protocol to req.protocol
      `${req.protocol}://${req.get(
        "host"
      )}/api/v1/auth/verify-email?token=${unHashed}`
    ),
  });

  // respond with created user (omit sensitive fields)
  res.status(201).json(
    new ApiResponse(201, "user created successfully, verification email sent", {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    })
  );
});

const login = asyncHandler(async (req, res) => {
  const { email, password, username } = req.body;

  if (!email) {
    throw new ApiError(400, "email is required");
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "user not found");
  }
  const isPasswordcorrect = await user.isPasswordCorrect(password);

  if (!isPasswordcorrect) {
    throw new ApiError(404, "INVALID PASSWORD");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry "
  );
  const option = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, option)
    .cookie("accessToken", accessToken, option)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "user logged in successfully"
      )
    );
});

// Corrected function name to match convention
export { registerUser, login };/*  */

// ...existing code...
import jwt from "jsonwebtoken";
// ...existing code...

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    const payload = { id: String(user._id), role: user.role ?? "USER" };

    const accessToken = jwt.sign(
      payload,
      process.env.JWT_ACCESS_TOKEN_SECRET || "dev_access_secret",
      { expiresIn: process.env.JWT_ACCESS_EXPIRES || "15m" }
    );

    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_TOKEN_SECRET || "dev_refresh_secret",
      { expiresIn: process.env.JWT_REFRESH_EXPIRES || "7d" }
    );

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("generateAccessAndRefreshToken error:", error);
    throw new ApiError(
      500,
      error.message || "something went wrong while generating token"
    );
  }
};
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/apiresponse.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { sendmail, emailVerificationContent } from "../utils/mail.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    // call the correctly named methods on the user model
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("generateAccessAndRefreshToken error:", error);
    throw new ApiError(500, "something went wrong while generating token");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, role } = req.body;

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const user = await User.create({
    username,
    email,
    password,
    isEmailVerified: false,
  });

  // standardize temp token return names
  const { unHashed, hashedToken, tokenExpiry } = user.generateTemporaryToken();

  // use correct property names
  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;
  await user.save({ validateBeforeSave: false });

  // send verification email
  await sendmail({
    email: user.email,
    subject: "Verify your email",
    emailVerificationContent: emailVerificationContent(
      user.username,
      `${req.protocol}://${req.get(
        "host"
      )}/api/v1/auth/verify-email?token=${unHashed}`
    ),
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { user: { id: user._id, username: user.username, email: user.email } },
        "User created successfully, verification email sent"
      )
    );
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  // ensure password field is selected if schema hides it
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .cookie("accessToken", accessToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

// ...existing code...
export { registerUser, login };
