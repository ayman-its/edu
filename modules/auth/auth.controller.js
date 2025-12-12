import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import prisma from "../../config/prisma.js";
import { transporter } from "../../config/nodemailer.js";

const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const RESET_TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutes

const googleClient = process.env.GOOGLE_CLIENT_ID
  ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
  : null;

const ensureJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET env var is required");
  }
  return process.env.JWT_SECRET;
};

const generateAccessToken = (userId) =>
  jwt.sign({ sub: userId }, ensureJwtSecret(), { expiresIn: ACCESS_TOKEN_TTL });

const createSession = async (userId) => {
  const token = crypto.randomBytes(40).toString("hex");
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

  await prisma.session.create({
    data: { userId, token, expiresAt },
  });

  return { token, expiresAt };
};

const setRefreshCookie = (res, token, expiresAt) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
  });
};

const sanitizedUser = (user) => ({
  id: user.id,
  email: user.email,
  createdAt: user.createdAt,
});

const buildAuthResponse = async (res, user) => {
  const accessToken = generateAccessToken(user.id);
  const session = await createSession(user.id);
  setRefreshCookie(res, session.token, session.expiresAt);
  return {
    accessToken,
    refreshToken: session.token,
    refreshTokenExpiresAt: session.expiresAt,
    user: sanitizedUser(user),
  };
};

const handleError = (res, error) => {
  console.error(error);
  return res.status(500).json({ message: "Something went wrong" });
};

export const signupWithPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if fields exist
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
        field: "email",
      });
    }

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
        field: "password",
      });
    }

    // Check types
    if (typeof email !== "string") {
      return res.status(400).json({
        message: "Email must be a string",
        field: "email",
      });
    }

    if (typeof password !== "string") {
      return res.status(400).json({
        message: "Password must be a string",
        field: "password",
      });
    }

    // Trim and validate email format
    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        message: "Invalid email format",
        field: "email",
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long",
        field: "password",
      });
    }

    const normalizedEmail = trimmedEmail.toLowerCase();

    const existingEmail = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingEmail) {
      return res.status(409).json({
        message: "Email already in use",
        field: "email",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashed,
      },
    });

    const payload = await buildAuthResponse(res, user);
    return res.status(201).json(payload);
  } catch (error) {
    return handleError(res, error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Validate email type
    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ message: "Invalid input types" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = await buildAuthResponse(res, user);
    return res.json(payload);
  } catch (error) {
    return handleError(res, error);
  }
};
export const logout = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    if (token) {
      await prisma.session.deleteMany({ where: { token } });
    }
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return res.status(204).send();
  } catch (error) {
    return handleError(res, error);
  }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "email is required" });
    }

    const normalizedEmail = email.toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    // Avoid user enumeration
    if (!user) {
      return res.json({
        message: "If that email exists, a reset code has been sent",
      });
    }

    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id, used: false },
    });

    const code = crypto.randomInt(100000, 999999).toString();
    const hashedToken = crypto.createHash("sha256").update(code).digest("hex");
    const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: hashedToken,
        expiresAt,
      },
    });

    const fromAddress = process.env.GMAIL_AUTH_USER || process.env.SMTP_FROM;

    await transporter.sendMail({
      to: normalizedEmail,
      from: fromAddress,
      subject: "Password reset code",
      text: `Your password reset code is ${code}. It expires in 15 minutes.`,
    });

    return res.json({
      message: "If that email exists, a reset code has been sent",
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) {
      return res
        .status(400)
        .json({ message: "email, code, and newPassword are required" });
    }

    const normalizedEmail = email.toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid reset request" });
    }

    const hashedToken = crypto.createHash("sha256").update(code).digest("hex");

    const tokenRecord = await prisma.passwordResetToken.findFirst({
      where: {
        userId: user.id,
        token: hashedToken,
        used: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!tokenRecord) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetToken.update({
        where: { id: tokenRecord.id },
        data: { used: true },
      }),
      prisma.passwordResetToken.deleteMany({
        where: { userId: user.id, used: false },
      }),
      prisma.session.deleteMany({ where: { userId: user.id } }),
    ]);

    return res.json({ message: "Password updated successfully" });
  } catch (error) {
    return handleError(res, error);
  }
};
