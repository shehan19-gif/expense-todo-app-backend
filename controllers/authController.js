const jwt = require("jsonwebtoken");
require("dotenv").config();

// User model import
const User = require("../models/User");

// User signup
exports.signup = async (req, res) => {
    const {firstName, lastName, birthDate, address, telephone, email, password} = req.body;

    try {
        // Create a new user
        const user = new User({
            firstName,
            lastName,
            birthDate,
            address,
            telephone,
            email,
            password
        });

        await user.save();
        return res.status(200).json({message: "New user created", user: {
            userId: user._id,
            username: user.firstName,
        }});

    } catch(err) {
        console.error(err);
        return res.status(500).json({message: "Server error"});
    }
}

// User login
exports.login = async (req, res) => {
    const {email, password} = req.body;

    try {
        // Find a user in db
        const user = await User.findOne({email, password});
        if(!user) {
            return res.status(401).json({message: "Invald credentials"});
        }

        // Create JWT token
        const token = jwt.sign(
            {userId: user._id, username: user.firstName},
            process.env.JWT_SECRET,
            {expiresIn: "1h"}
        );

        // Set token in HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Secure in production
            sameSite: "none",
            maxAge: 60*60*1000 // 1h
        });

        return res.status(200).json({message: "Login successful", user: {
            userId: user._id,
            username: user.firstName,
        }});

    } catch(err) {
        console.error("In console error" + err);
        return res.status(500).json({message: err});
    }
};

// User authentication
exports.userVerify = async (req, res) => {
    try {
        const token = req.cookies.token;

        if(!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if(!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        res.json({message: "Login successful", user: {
            userId: user._id,
            username: user.firstName,
        }});

    } catch(err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// User logout
exports.logout = (req, res) => {
    // Clear the token cookie
    res.clearCookie("token");
    return res.status(200).json({message: "Logout successful"});
}