const router = require("express").Router();
const multer = require("multer");
const path = require("path");

const controller = require("../controllers/image.controller");

// STORAGE
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const unique =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9);

    cb(
      null,
      unique + path.extname(file.originalname)
    );
  },
});

// SOLO IMÁGENES
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Solo imágenes"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// RUTAS
router.post(
  "/upload",
  upload.single("image"),
  controller.upload
);

router.get(
  "/gallery",
  controller.gallery
);

router.get(
  "/quarantine",
  controller.quarantine
);

router.put(
  "/approve/:id",
  controller.approve
);

router.delete(
  "/reject/:id",
  controller.reject
);

module.exports = router;