const express = require("express");
const router = express.Router();

// Import user controller
const userController = require("../controllers/userController");

// Import middlewares
const authenticateToken = require("../middleware/authMiddleware");

router.put("/forgot/password", userController.userPasswordResetExternal);
router.get("/profile", authenticateToken, userController.userProfileView);
router.put("/profile/update", authenticateToken, userController.userProfileUpdate);
router.put("/profile/credentials/update", authenticateToken, userController.userCredentialsUpdate);
router.delete("/profile/delete", authenticateToken, userController.userAccountDelete);

module.exports = router;