import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import { db } from "./db.js";
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.post("/api/signup", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Username, email, and password are required." });
  }

  try {
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const now = new Date();

    const user = await db.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        points: 1,
        lastLoginAt: now,
        visitDays: 1,
        createdAt: now,
        updatedAt: now,
      },
    });

    return res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
      points: user.points,
      visitDays: user.visitDays,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to create account." });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const now = new Date();
    const sameDay =
      user.lastLoginAt &&
      new Date(user.lastLoginAt).toDateString() === now.toDateString();
    const updateData = {
      lastLoginAt: now,
      updatedAt: now,
    };

    if (!sameDay) {
      updateData.points = user.points + 1;
      updateData.visitDays = user.visitDays + 1;
    }

    const updatedUser = await db.user.update({
      where: { email },
      data: updateData,
    });

    return res.json({
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      points: updatedUser.points,
      visitDays: updatedUser.visitDays,
      lastLoginAt: updatedUser.lastLoginAt,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to authenticate." });
  }
});

app.get("/api/user/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await db.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        username: true,
        email: true,
        points: true,
        visitDays: true,
        lastLoginAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to load user." });
  }
});

// Bind to localhost explicitly to avoid permission errors when binding 0.0.0.0
app.listen(port, "127.0.0.1", () => {
  console.log(`Server listening on http://localhost:${port}`);
});
