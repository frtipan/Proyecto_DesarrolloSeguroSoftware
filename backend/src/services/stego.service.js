const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { fileTypeFromFile } = require("file-type");
const detectarStego = require("../utils/stegoDetector");

async function analizarImagen(filePath) {
  const type = await fileTypeFromFile(filePath);

  if (!type || !["image/jpeg", "image/png", "image/webp"].includes(type.mime)) {
    throw new Error("Formato de imagen inválido");
  }

  return detectarStego(filePath);
}

async function limpiarImagen(filename) {
  const uploadsDir = path.join(__dirname, "../../uploads");

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const originalPath = path.join(uploadsDir, filename);

  const cleanName = "clean-" + Date.now() + ".jpg";
  const cleanPath = path.join(uploadsDir, cleanName);

  await sharp(originalPath)
    .jpeg({ quality: 95 })
    .toFile(cleanPath);

  fs.unlinkSync(originalPath);

  return cleanName;
}

module.exports = {
  analizarImagen,
  limpiarImagen,
};