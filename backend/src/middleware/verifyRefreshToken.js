import jwt from "jsonwebtoken";

const verifyRefreshToken = (refreshToken) => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error("JWT_REFRESH_SECRET is not configured");
  }

  try {
    const decoded = jwt.verify(refreshToken, secret);
    return decoded;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return null;
    }
    throw error;
  }
};

export default verifyRefreshToken;
