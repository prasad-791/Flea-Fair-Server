const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // profile image
    profileImg: {
        type: String,
        default: null,
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNo:{
        type: Number,
        unique: true,
        required: false,
    },
    email:{
        type: String,
        match:/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
        required: true,
        unique: true,
    },    
    password:{
        type: String,
        required: true,
    },
    emailToken:{
        type: String,  
    },
    isEmailVerified:{
        type: Boolean,
        default: false,
    },
    isPhoneNoVerified:{
        type: Boolean,
        default: false,
    },
    city:{
        type: String,
        // required: true,
    },
    // 4 more lists: FavouriteList ShoppingCartList OwnedItemList PurchasedItemList 
    // advanced: NotificationList
});

const User = mongoose.model('User',userSchema);
module.exports = User;