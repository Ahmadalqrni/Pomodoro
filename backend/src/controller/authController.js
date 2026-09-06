import bcrypt from "bcryptjs";
import prisma from "../config/db.js";
import ApiError from "../utils/ApiError.ts";
import catchAsync from "../utils/catchAsync.ts";
import generateToken from "../utils/genratetoken.js";

// signup
const signup = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ApiError(409, "Already Exists Emaill");
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      password: hashed,
      email,
      points: 1,
      lastVisit: new Date(),
    },
    omit: { password: true },
  });
  generateToken(user.id, res);
  res.status(201).json({
    status: "success",
    data: { user },
  });
});

//login
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // if input was empty

  // start search
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // not exists out edit
  if (!user) {
    throw new ApiError(409, "Invalid email or password");
  }

  // checking compare password
  const validpassword = await bcrypt.compare(password, user.password);

  if (!validpassword) {
    throw new ApiError(409, "Invalid email or password");
  }

  generateToken(user.id, res);
  res.status(200).json({
    status: "success",
    data: {
      user: { id: user.id, name: user.name, email: user.email },
    },
  });
});

const logout = (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.status(200).json({ message: "Logged out" });
};

export { signup, login, logout };
