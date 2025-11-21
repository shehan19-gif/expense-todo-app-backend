// Import Todo model
const Todo = require("../models/Todo");

// Create a new todo
exports.createTodo = async (req, res) => {
    const {
        title,
        dueDate,
        description,
        priority,
        category,
        user,
        isCompleted
    } = req.body;

    try {
        const todo = new Todo({
            title,
            dueDate,
            description,
            priority,
            category,
            user,
            isCompleted
        });

        await todo.save();
        return res.status(200).json({message: "New todo added", todo});

    } catch(err) {
        console.error(err);
        return res.status(500).json({message: "Server error", error: err});
    }
}

// View a single todo
exports.readATodo = async (req, res) => {
    try {
        const todo = await Todo.findOne({_id: req.params.id});

        if(!todo) {
            return res.status(404).json({message: "No data found"});
        }

        return res.status(200).json({data: todo});
    } catch(err) {
        console.error(err);
        return res.status(500).json({message: "Error retieving data", error: err});
    }
}

// View all todos
exports.readAllTodos = async (req, res) => {
    try {
        const todos = await Todo.find({user: req.user.userId});

        if(!todos) {
            return res.status(404).json({message: "No data found"});
        }

        return res.status(200).json({data: todos});

    } catch(err) {
        console.error(err);
        return res.status(500).json({message: "Error retieving data", error: err});
    }
}

// Update a todo
exports.updateTodo = async (req, res) => {
    const {
        title,
        dueDate,
        description,
        priority,
        category,
        isCompleted
    } = req.body;

    try {
        const updateResult = await Todo.updateOne({_id: req.params.id}, {
            title,
            dueDate,
            description,
            priority,
            category,
            isCompleted
        });

        if(!(updateResult.modifiedCount > 0)) {
            return res.status(200).json({message: "Todo not found or already updated with the same content"});
        }

        return res.status(200).json({message: "Todo updated successfully"});

    } catch(err) {
        console.error(err);
        return res.status(404).json({message: "Error updating todo", error: err});
    }
}

// Update a todo complete status
exports.updateCompleteStatus = async (req, res) => {
    const {isCompleted} = req.body;

    try {
        const updateIsCompleted = await Todo.updateOne({_id: req.params.id}, {isCompleted});

        if(!(updateIsCompleted.modifiedCount > 0)) {
            return res.status(404).json({message: "Completed status not found or already updated with the same content"});
        }

        return res.status(200).json({message: "Todo's status updated successfully"});

    } catch(err) {
        console.error(err);
        return res.status(404).json({message: "Error updating todo's status", error: err});
    }
}

// Delete all todos
exports.deleteTodo = async (req, res) => {
    try {
        const deleteResult = await Todo.deleteOne({_id: req.params.id});

        if(!(deleteResult.deletedCount > 0)) {
            return res.status(404).json({message: "Todo not found or already deleted"});
        }

        return res.status(200).json({message: "Successfully deleted", result: deleteResult});
        
    } catch(err) {
        console.error(err);
        return res.status(404).json({message: "Error deleting todo", error: err});
    }
}