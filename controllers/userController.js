// Import User model
const User = require("../models/User");
const Expense = require("../models/Expense");
const Todo = require("../models/Todo");

// User data view
exports.userProfileView = async (req, res) => {
    try {
        const userData = await User.findOne({_id: req.user.userId}).select({_id: 0, password: 0});

        if(!userData) {
            return res.status(404).json({message: "No data found"});
        }

        return res.status(200).json({data: userData});

    } catch(err) {
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
}

// User data update
exports.userProfileUpdate = async (req, res) => {
    const {firstName, lastName, birthDate, address, telephone, email, password} = req.body;

    try {
        const updateResult = await User.updateOne({_id: req.user.userId}, {
            firstName,
            lastName,
            birthDate,
            address,
            telephone,
            email,
            password
        });

        if(!(updateResult.modifiedCount > 0)) {
            return res.status(200).json({message: "User not found or already updated with the same content"});
        }

        return res.status(200).json({message: "User updated successfully"});

    } catch(err) {
        console.error(err);
        return res.status(404).json({message: "Error updating profile", error: err});
    }
}

// User password update
exports.userCredentialsUpdate = async (req, res) => {
    const {previousPassword, currentPassword} = req.body;

    try {
        const user = await User.findOne({_id: req.user.userId});

        if(user.password !== previousPassword) {
            return res.status(404).json({message: "Previous password didn't matched"});
        }

        const updateResult = await User.updateOne({_id: req.user.userId}, {
            password: currentPassword
        });

        if(!(updateResult.modifiedCount > 0)) {
            return res.status(200).json({message: "User not found or already updated with the same content"});
        }

        return res.status(200).json({message: "Password successfully updated"});

    } catch(err) {
        console.error(err);
        return res.status(404).json({message: "Error updating password", error: err});
    }
}

// User password update externally
exports.userPasswordResetExternal = async (req, res) => {
    const {email, newPassword} = req.body;

    try {
        const user = await User.findOne({email});

        if(user) {
            const updateResult = await User.updateOne({email}, {password: newPassword});

            return res.status(200).json({message: "Password successfully updated", success: true});
        }

        return res.status(404).json({message: "Doesn't exist a user account", success: false});

    } catch(err) {
        console.error(err);
        return res.status(404).json({message: "Error updating user password", error: err});
    }
}

// User account delete
exports.userAccountDelete = async (req, res) => {
    try {
        const deleteResult = await User.deleteOne({_id: req.user.userId});

        if(deleteResult.deletedCount > 0) {
            // Delete all expense records
            await Expense.deleteMany({user: req.user.userId});

            // Delete all todo records
            await Todo.deleteMany({user: req.user.userId});

            // Clear cookie
            res.clearCookie("token");

            return res.status(200).json({message: "Successfully deleted", result: deleteResult});

        } else {
            return res.status(404).json({message: "User not found or already deleted"});
        }

    } catch(err) {
        console.error(err);
        return res.status(404).json({message: "Error deleting user", error: err});
    }
}