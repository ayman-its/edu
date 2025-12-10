import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_AUTH_USER,
    pass: process.env.GMAIL_AUTH_PASS,
  },
});
