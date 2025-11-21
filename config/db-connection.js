const mongoose = require("mongoose");

async function dbConnection(connectionString) {
    await mongoose.connect(connectionString);
}

module.exports = dbConnection;