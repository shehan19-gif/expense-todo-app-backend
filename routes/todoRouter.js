const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");

// Import todo controller
const todoController = require("../controllers/todoController");

router.get("/", authenticateToken, todoController.readAllTodos);
router.get("/:id", authenticateToken, todoController.readATodo);
router.post("/create", authenticateToken, todoController.createTodo);
router.put("/:id", authenticateToken, todoController.updateTodo);
router.put("/status/:id", authenticateToken, todoController.updateCompleteStatus);
router.delete("/:id", authenticateToken, todoController.deleteTodo);

module.exports = router;