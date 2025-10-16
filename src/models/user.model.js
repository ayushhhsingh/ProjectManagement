import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "enter the username"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowecase: true,
      unique: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    isEmailVerified: {
      type: Boolean,
      required: false,
    },
    refreshToken: {
      type: String,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordexpiry: {
      type: Date,
    },
    emailVarificationExpiry: {
      type: Date,
    },
    emailVarificationTOken: {
      type: String,
    },
  },
  {
    Timestamps: true,
  }
);
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});
UserSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};
// generating access token and refresh token
(UserSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      // payload
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
}),
  (UserSchema.methods.generatingRefreshtoken = function () {
    return jwt.sign(
      {
        _id: this._id,
        email: this.email,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
  });
UserSchema.methods.generateTemporaryToken = function () {
  const unHashed = crypto.randomBytes(20).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(unHashed)
    .digest("hex");

  const TokenExpiry = Date.now() + 20 * 60 * 100;
  return { unHashed, hashedToken, TokenExpiry };
};

export const User = mongoose.model("user", UserSchema);
