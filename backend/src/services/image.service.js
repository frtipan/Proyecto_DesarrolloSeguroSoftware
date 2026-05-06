const router = require("express").Router();
const multer = require("multer");
const c = require("../controllers/image.controller");

const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("image"), c.upload);

module.exports = router;