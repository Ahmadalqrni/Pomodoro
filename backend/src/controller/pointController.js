import prisma from "../config/db.js";

const addpoint = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export { addpoint };
