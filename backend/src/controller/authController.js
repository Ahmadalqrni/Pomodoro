import prisma from "../config/db.js";
import generateToken from "../utils/genratetoken.js";
import bcrypt from "bcryptjs";

// signup
const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    }

    if (!password || (password.length < 8 && password > 72)) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ message: "This user already exists" });
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
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // if input was empty 
    if (!password || !email) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    // start search 
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // not exists out 
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    // checking compare password
    const validpassword = await bcrypt.compare(password, user.password);

    if (!validpassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    generateToken(user.id, res);
    res.status(200).json({
      status: "success",
      data: {
        user: { id: user.id, name: user.name, email: user.email },
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const logout = (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.status(200).json({ message: "Logged out" });
};

export { signup, login, logout };
