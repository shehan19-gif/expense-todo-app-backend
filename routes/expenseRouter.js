const express = require("express");
const router = express.Router();

// Import expense controller
const expenseController = require("../controllers/expenseController");

// Import middlewares
const authenticateToken = require("../middleware/authMiddleware");

router.get("/", authenticateToken, expenseController.readAllExpenses);
router.get("/:id", authenticateToken, expenseController.getAExpense);
router.post("/create", authenticateToken, expenseController.createExpense);
router.put("/:id", authenticateToken, expenseController.updateExpense);
router.delete("/:id", authenticateToken, expenseController.deleteExpense);

module.exports = router;