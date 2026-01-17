import prisma from "../../config/prisma.js";

const sanitizedUser = (user) => ({
  id: user.id,
  email: user.email,
  isAdmin: user.isAdmin,
  createdAt: user.createdAt,
});

const normalizeEmail = (email) => email.trim().toLowerCase();

export const promoteToAdmin = async (req, res) => {
  try {
    const { email, userId } = req.body;

    if (!email && !userId) {
      return res.status(400).json({ message: "email or userId is required" });
    }

    const adminCount = await prisma.user.count({ where: { isAdmin: true } });

    if (adminCount === 0) {
      const bootstrapSecret = process.env.ADMIN_BOOTSTRAP_SECRET;
      if (!bootstrapSecret) {
        return res
          .status(500)
          .json({ message: "Admin bootstrap is not configured" });
      }
      const provided = req.headers["x-admin-bootstrap"];
      if (provided !== bootstrapSecret) {
        return res.status(403).json({ message: "Invalid bootstrap secret" });
      }
    } else {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
    }

    let user = null;

    if (userId) {
      user = await prisma.user.findUnique({ where: { id: userId } });
    } else if (email) {
      user = await prisma.user.findUnique({
        where: { email: normalizeEmail(email) },
      });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isAdmin) {
      return res.status(409).json({ message: "User is already an admin" });
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { isAdmin: true },
    });

    return res.json({ user: sanitizedUser(updated) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

