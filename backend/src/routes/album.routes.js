const router = require("express").Router();
const controller = require("../controllers/album.controller");

router.post("/create", controller.create);
router.get("/mine/:userId", controller.mine);

router.get("/pending", controller.pending);
router.put("/approve/:id", controller.approve);
router.delete("/reject/:id", controller.reject);

module.exports = router;