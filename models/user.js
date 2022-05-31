const mongoose = require('mongoose');
const { bool } = require('sharp');
const Product = require('./product');

const favItemListSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    },
    isAddedToCart: {
        type: Boolean,
        required: true,
        default: false,
    },
});

const itemListSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }
});

const userSchema = new mongoose.Schema({
    // profile image
    profileImg: {
        type: Buffer,
        default: null,
    },
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNo:{
        type: Number,
        required: false,
        default: null,
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
    ownedItemList: [
        itemListSchema
    ],
    purchasedItemList: [
        itemListSchema
    ],
    shoppingCartList: [
        itemListSchema
    ],
    favouriteItemList: [
        favItemListSchema
    ]
    // advanced: NotificationList
});

const User = mongoose.model('User',userSchema);
module.exports = User;