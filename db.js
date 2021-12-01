const mongoose = require('mongoose');
require('dotenv').config();
const dbURL = process.env.MONGODB_URL;

module.exports = async function connection(){
    try {
        
        await mongoose.connect(dbURL);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log(error);
    }
}