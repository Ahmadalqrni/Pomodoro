import jwt from "jsonwebtoken";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};

const setTokenCookie = (res, name, token) => {
  const decoded = jwt.decode(token);
  if (
    !decoded ||
    typeof decoded === "string" ||
    typeof decoded.exp !== "number"
  ) {
    throw new Error(`Could not determine ${name} expiration`);
  }

  res.cookie(name, token, {
    ...cookieOptions,
    maxAge: Math.max(0, decoded.exp * 1000 - Date.now()),
  });
};

const generateToken = (userId, res) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "10m",
  });
  setTokenCookie(res, "jwt", token);
};

const generateRefreshToken = (userId, res) => {
  const token = jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  });
  setTokenCookie(res, "refreshToken", token);
};

export { generateToken, generateRefreshToken, cookieOptions };
