import QRCode from "qrcode";
import fs from "fs";
import path from "path";

const QR_DIR = "uploads/qrcodes";
if (!fs.existsSync(QR_DIR)) fs.mkdirSync(QR_DIR, { recursive: true });

/**
 * Item 12: Generates a QR code that links to a craft's public provenance/
 * profile page and saves it as a PNG file, returning the file path.
 */
export const generateCraftQR = async (craftId, publicProvenanceId) => {
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const targetUrl = `${clientUrl}/story?craft=${craftId}&verify=${publicProvenanceId}`;

  const filePath = path.join(QR_DIR, `${craftId}.png`);
  await QRCode.toFile(filePath, targetUrl, {
    width: 400,
    margin: 2,
    color: { dark: "#1a1a1a", light: "#ffffff" },
  });

  return { filePath: `/${filePath}`, targetUrl };
};
