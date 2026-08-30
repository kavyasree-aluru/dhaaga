import nodemailer from "nodemailer";

const getValue = (...keys) => keys.map((key) => process.env[key]).find((value) => Boolean(value));

const smtpHost = getValue("SMTP_HOST", "EMAIL_HOST");
const smtpPort = Number(getValue("SMTP_PORT", "EMAIL_PORT") || 587);
const smtpSecure = String(getValue("SMTP_SECURE", "EMAIL_SECURE") || "false").toLowerCase() === "true";
const smtpUser = getValue("SMTP_USER", "EMAIL_USER");
const smtpPass = getValue("SMTP_PASS", "EMAIL_PASS");
const emailFrom = getValue("EMAIL_FROM", "SMTP_FROM") || smtpUser || "noreply@dhaaga.local";

const buildConfiguredTransporter = () => {
  if (!smtpHost || !smtpUser || !smtpPass) {
    return null;
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: { user: smtpUser, pass: smtpPass },
  });
};

export const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = buildConfiguredTransporter();

  if (!transporter) {
    console.warn("Email delivery is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS in backend env.");
    return false;
  }

  try {
    const info = await transporter.sendMail({
      from: emailFrom,
      to,
      subject,
      text,
      html,
    });
    return !!info?.messageId;
  } catch (error) {
    console.error("Email delivery failed:", error?.message || error);
    return false;
  }
};

export const sendPasswordResetEmail = async ({ email, name, resetToken }) => {
  const resetUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/auth?mode=reset-password&token=${encodeURIComponent(resetToken)}`;

  return sendEmail({
    to: email,
    subject: "Reset your DHAAGA password",
    text: `Hi ${name || "there"},\n\nUse this link to reset your DHAAGA password:\n${resetUrl}\n\nIf you did not request this email, you can ignore it.`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #3d2314; line-height: 1.6;">
        <h2 style="margin-bottom: 12px;">Reset your DHAAGA password</h2>
        <p>Hi ${name || "there"},</p>
        <p>Click the link below to reset your password:</p>
        <p><a href="${resetUrl}" style="color: #b85334; font-weight: 700;">Reset my password</a></p>
        <p>If you did not request this email, you can safely ignore it.</p>
      </div>
    `,
  });
};

export const sendWelcomeEmail = async ({ email, name }) => {
  return sendEmail({
    to: email,
    subject: "Welcome to DHAAGA",
    text: `Hi ${name || "there"},\n\nWelcome to DHAAGA. We are delighted to have you join our community of makers, buyers, and heritage storytellers.`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #3d2314; line-height: 1.6;">
        <h2 style="margin-bottom: 12px;">Welcome to DHAAGA</h2>
        <p>Hi ${name || "there"},</p>
        <p>We are delighted to have you join our community of makers, buyers, and heritage storytellers.</p>
        <p>Explore artisans, discover crafted stories, and support living traditions.</p>
      </div>
    `,
  });
};

export const sendSupportRequestEmail = async ({ to, artisanName, customerName, supportId, message, contactEmail }) => {
  const supportLink = `${process.env.CLIENT_URL || "http://localhost:5173"}/logistics`;

  return sendEmail({
    to,
    subject: `New support request for ${artisanName || "your craft"}`,
    text: `Hi ${artisanName || "there"},\n\nYou have a new DHAAGA support request from ${customerName || "a customer"}.\nSupport ID: ${supportId}\nCustomer email: ${contactEmail || "Not provided"}\nMessage: ${message || "No additional message provided"}\n\nReview it here: ${supportLink}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #3d2314; line-height: 1.6;">
        <h2 style="margin-bottom: 12px;">New support request</h2>
        <p>Hi ${artisanName || "there"},</p>
        <p>You have a new DHAAGA support request from ${customerName || "a customer"}.</p>
        <p><strong>Support ID:</strong> ${supportId}</p>
        <p><strong>Customer email:</strong> ${contactEmail || "Not provided"}</p>
        <p><strong>Message:</strong> ${message || "No additional message provided"}</p>
        <p><a href="${supportLink}" style="color: #b85334; font-weight: 700;">Review request</a></p>
      </div>
    `,
  });
};
