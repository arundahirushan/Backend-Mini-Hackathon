const express = require("express");
const router = express.Router();
const destinationController = require("../controllers/destinationController");
const verifyToken = require("../middleware/auth");
const requireAdmin = require("../middleware/requireAdmin");

router.get("/", destinationController.getAll);
router.get("/:id", destinationController.getOne);

router.post("/", verifyToken, requireAdmin, destinationController.create);
router.put("/:id", verifyToken, requireAdmin, destinationController.update);
router.delete("/:id", verifyToken, requireAdmin, destinationController.remove);

module.exports = router;
