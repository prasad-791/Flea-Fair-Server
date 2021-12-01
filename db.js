const mongoose = require('mongoose');
require('dotenv').config();
const dbURL = "mongodb+srv://ANI791:Prasad252791@cluster0.m8yqt.mongodb.net/fleaFair?retryWrites=true";

module.exports = async function connection(){
    try {
        
        await mongoose.connect(dbURL);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log(error);
    }
}