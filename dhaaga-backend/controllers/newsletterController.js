import asyncHandler from "express-async-handler";
import { sendWelcomeEmail } from "../utils/mailer.js";

export const subscribeNewsletter = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email || !String(email).trim()) {
    res.status(400);
    throw new Error("Email is required");
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  void sendWelcomeEmail({
    email: normalizedEmail,
    name: normalizedEmail.split("@")[0] || "friend",
  });

  res.status(200).json({
    success: true,
    message: "Successfully subscribed to DHAAGA updates.",
    email: normalizedEmail,
  });
});
