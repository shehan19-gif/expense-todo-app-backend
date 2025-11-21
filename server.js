// Importing modules
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// Db connection
const dbConnection = require("./config/db-connection");
dbConnection(process.env.CONNECTION_STRING).catch(err => console.error(err));

// Import routes
const authRoutes = require("./routes/authRouter");
const userRoutes = require("./routes/userRouter");
const expenseRoutes = require("./routes/expenseRouter");
const todoRoutes = require("./routes/todoRouter");

// Import middlewares
const authenticateToken = require("./middleware/authMiddleware");

// Express app create
const app = express();

// Middleware implementation
app.use(express.json());
app.use(express.urlencoded({extended: true}));
/* app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
})); */

const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(cors({
    origin: allowedOrigin,
    credentials: true,
}));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/todos", todoRoutes);

// Testing route
app.get("/", authenticateToken, (req, res) => {
    res.status(200).json({message: "success"});
});

// Catch all other routes
app.all("/{*splat}", (req, res) => {
    res.status(404).json({message: "404 - Page not found"});
});

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`App listening at http://localhost:${process.env.PORT}`);
});