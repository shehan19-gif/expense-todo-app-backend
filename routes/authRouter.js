const express = require("express");
const router = express.Router();

// Import authentication controller
const authController = require("../controllers/authController");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/verify", authController.userVerify);
router.post("/logout", authController.logout);

module.exports = router;