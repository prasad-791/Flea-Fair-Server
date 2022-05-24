const mongoose = require('mongoose');
require('dotenv').config();
const dbURL = process.env.MONGODB_URL;

module.exports = async function connection(){
    try {
        
        await mongoose.connect(dbURL);
        console.log('Database Connected');
    } catch (error) {
        console.log(error);
    }
}