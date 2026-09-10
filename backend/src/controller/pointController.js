import prisma from "../config/db.js";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";

const addpoint = catchAsync(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const today = new Date().toISOString().split("T")[0];
  const last = user.lastVisit
    ? user.lastVisit.toISOString().split("T")[0]
    : null;

  if (today === last) {
    return res.status(200).json({ message: "Already got today's point" });
  }

  const updated = await prisma.user.update({
    where: { id: req.userId },
    data: {
      points: { increment: 1 },
      lastVisit: new Date(),
    },
  });

  res.status(200).json({
    message: "Point added",
    points: updated.points,
  });
});

const showpoint = catchAsync(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { points: true },
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  res.status(200).json({
    status: "sucssed",
    points: user.points,
  });
});

export { addpoint, showpoint };
