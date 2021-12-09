const express = require('express');
const Product = require('../models/product');
const checkAuth = require('./middleware/auth');
const productController = require('./controllers/productController');
const upload = require('./middleware/uploadImage');
require('dotenv').config();

const router = express.Router();

// Add New Product
router.post('/addproduct/:id',checkAuth,upload.array('file'),productController.addProductController,(err,req,res,next)=>{
    res.status(400).send({error:err.message});
});

// Get Top 10 Latest Products
router.get('/getlatestproducts/',checkAuth,productController.getLatestProductsController,(err,req,res,next)=>{
    res.status(400).send({error:err.message});
});

// Get Specific Product by ID
router.get('/:id',checkAuth,productController.getProductController,(err,req,res,next)=>{
    res.status(400).send({error:err.message});
});

module.exports = router;