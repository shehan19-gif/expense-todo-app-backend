// Expense model import
const Expense = require("../models/Expense");

// Add a new expense
exports.createExpense = async (req, res) => {
    const {
        amount,
        type = "expense",
        category,
        date,
        paymentMethod,
        description,
        note = "",
        user
    } = req.body;

    try {
        const expense = new Expense({
            amount,
            type,
            category,
            date,
            paymentMethod,
            description,
            note,
            user
        });

        await expense.save();
        res.status(200).json({message: "New expense added", expense});

    } catch(err) {
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
}

// Read all expenses
exports.readAllExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({user: req.user.userId});

        if(!expenses) {
            return res.status(404).json({message: "No data found"});
        }

        return res.status(200).json({data: expenses});

    } catch(err) {
        console.error(err);
        return res.status(500).json({message: err});
    }
}

exports.getAExpense = async (req, res) => {
    try {
        const expense = await Expense.findOne({_id: req.params.id});

        if(!expense) {
            return res.status(404).json({message: "No data found"});
        }

        return res.status(200).json({data: expense});
    } catch(err) {
        console.error(err);
        return res.status(500).json({message: err});
    }
}

// Update an expense
exports.updateExpense = async (req, res) => {
    const {
        amount,
        type,
        category,
        date,
        paymentMethod,
        description,
        note
    } = req.body;

    try {
        const updateResult = await Expense.updateOne({_id: req.params.id}, {
            amount,
            type,
            category,
            date,
            paymentMethod,
            description,
            note
        });

        if(!(updateResult.modifiedCount > 0)) {
            return res.status(200).json({message: "Expense not found or already updated with the same content"});
        }

        return res.status(200).json({message: "Expense updated successfully"});

    } catch(err) {
        console.error(err);
        return res.status(404).json({message: "Error updating expense", error: err});
        
    }
}

// Delete an expense
exports.deleteExpense = async (req, res) => {
    try {
        const deleteResult = await Expense.deleteOne({_id: req.params.id});
        
        if(!(deleteResult.deletedCount > 0)) {
            return res.status(404).json({message: "Expense not found or already deleted"});
        }

        return res.status(200).json({message: "Successfully deleted", result: deleteResult});

    } catch(err) {
        console.error(err);
        return res.status(404).json({message: "Error deleting expense", error: err});

    }
}