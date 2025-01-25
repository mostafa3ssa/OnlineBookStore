const mongoose = require('mongoose');

async function connectToDatabase() {
    try {
        await mongoose.connect('mongodb://localhost:27017/mostafa');
        console.log('Database connection successful');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1); 
    }
}


module.exports = connectToDatabase;
