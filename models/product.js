const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productImages: [
        {
            type: Buffer
        }
    ],
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
});

const Product = mongoose.model('Product',productSchema);
module.exports = Product;