import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  const token = req.cookies.jwt;
  const secret = process.env.JWT_SECRET;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized. No token provided.",
    });
  }
  if (!secret) {
    return next(new Error("JWT_SECRET is not configured"));
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.userId = decoded.id;
    next();
  } catch (error) {
    if (!(error instanceof jwt.JsonWebTokenError)) {
      return next(error);
    }
    return res.status(401).json({
      message: "Unauthorized - Invalid or expired token",
    });
  }
};

export default protect;
