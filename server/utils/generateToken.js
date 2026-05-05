// server/utils/generateToken.js

import jwt from "jsonwebtoken"; // TOKEN GENERATION

// ACCESS TOKEN WITH SHORT EXPIRY

export const generateAccessToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};

// REFRESH TOKEN WITH LONGER EXPIRY

export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};