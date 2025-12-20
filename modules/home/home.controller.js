import prisma from "../../config/prisma.js";

export const getHome = async (req, res) => {
  try {
    const home = await prisma.home.findUnique({
      where: { id: 1 },
    });
    res.json(home);
  } catch (error) {
    res.status(500).json({ message: "Failed to get home" });
  }
};