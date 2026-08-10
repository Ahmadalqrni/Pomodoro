import prisma from "../config/db.js";

console.log("me controllrt");
const test = async (req, res) => {
  const { text } = req.body;

  const createtext = await prisma.text.create({
    data: {
      text: text,
    },
  });
  res.status(200).json({
    status: "succssed",
    data: {
      createtext,
    },
  });
};

export { test };
