import jwt from "jsonwebtoken";
import prisma from "../../config/prisma.js";

const ensureJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET env var is required");
  }
  return process.env.JWT_SECRET;
};

const getTokenFromRequest = (req) => {
  const header = req.headers.authorization;
  if (!header) return null;
  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token;
};

const loadUserFromToken = async (token) => {
  const payload = jwt.verify(token, ensureJwtSecret());
  if (!payload?.sub) {
    return null;
  }
  return prisma.user.findUnique({ where: { id: payload.sub } });
};

export const attachUser = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return next();
    }

    const user = await loadUserFromToken(token);
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const requireAuth = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return res.status(401).json({ message: "Missing token" });
    }

    const user = await loadUserFromToken(token);
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }
  return next();
};

