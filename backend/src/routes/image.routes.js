const router = require("express").Router();
const multer = require("multer");
const path = require("path");

const controller = require("../controllers/image.controller");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const unique =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post(
  "/upload",
  upload.single("image"),
  controller.upload
);

router.get("/gallery", controller.gallery);
router.get("/quarantine", controller.quarantine);
router.put("/approve/:id", controller.approve);
router.delete("/reject/:id", controller.reject);

module.exports = router;