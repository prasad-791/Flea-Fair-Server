const User = require('../../models/user');
const Product = require('../../models/product');
const sharp = require('sharp');

require('dotenv').config();

const mode = process.env.mode

// ADD NEW PRODUCT
exports.addProductController = async(req,res)=>{
    try{
        var user = await User.findOne({_id: req.params.id});
        if(user){
            let buffer = [];
            var files = [];
            files = req.files;
            for(var i=0;i<files.length;i++){
                buffer.push(await sharp(files[i].buffer).png().toBuffer());
            }
            if(user.isPhoneNoVerified){
                const product = new Product({
                    productImages: buffer,
                    title: req.body.title,
                    price: req.body.price,
                    description: req.body.description,
                    quantity: req.body.quantity,
                    owner: user
                });
                await product.save();
                user.ownedItemList.push(product);
                await user.save();
                res.status(200).send({
                    "message": "Added Product Successfully",
                })
            }else{
                res.status(403).send({
                    "error": "Please Verify Phone No before Adding",
                })
            }
        }else{
            res.status(404).send({
                "error": "Cannot find User"
            });
        }

    }catch(err){
        console.log(err);
        if(mode === "DEVELOPMENT"){
            res.status(400).send({
                "error": err,
            });
        }else{
            res.status(400).send({
                "error": err.message,
            });
        }
    }
};

// GET TOP 10 LATEST PRODUCTS
exports.getLatestProductsController = async(req,res)=>{
    try{

        var latestProducts = await Product.find({}).sort({_id:-1}).limit(10);
        var products = [];
        for(var i=0;i<latestProducts.length;i++){
            var owner = await User.findOne({_id:latestProducts[i].owner});
            var images = [];
            for(var j=0;j<latestProducts[i].productImages.length;j++){
                images.push(
                    {
                        j: latestProducts[i].productImages[j].toString('base64'),
                    }
                );
            }
            var temp = {
                "id": latestProducts[i]._id,
                "title": latestProducts[i].title,
                "description": latestProducts[i].description,
                "price": latestProducts[i].price,
                "quantity": latestProducts[i].quantity,
                "ownerID": owner._id,
                "ownerPhoneNo": owner.phoneNo,
                "productImages": images,
            };
            products.push(temp);
        }

        res.status(200).send({"data":products});

    }catch(e){
        if(mode === "DEVELOPMENT"){
            res.status(400).send({
                "error": err,
            });
        }else{
            res.status(400).send({
                "error": err.message,
            });
        }
    }
};

// GET SPECIFIC PRODUCT BY ID
exports.getProductByIDController = async(req,res) =>{
    try{
        var temp = await Product.findOne({_id: req.params.id});
        if(temp){
            var owner = await User.findOne({_id:temp.owner});
            var images = [];
            for(var j=0;j<temp.productImages.length;j++){
                images.push(
                    {
                        j: temp.productImages[j].toString('base64'),
                    }
                );
            }

            var product = {
                "id": temp._id,
                "title": temp.title,
                "description": temp.description,
                "price": temp.price,
                "quantity": temp.quantity,
                "ownerID": owner._id,
                "ownerPhoneNo": owner.phoneNo,
                "productImages": images,
            };

            res.status(200).send({
                "data": product,
            });
        }else{
            res.status(404).send({
                "error": "No such product found"
            });
        }
    }catch(e){
        if(mode === "DEVELOPMENT"){
            res.status(400).send({
                "error": err,
            });
        }else{
            res.status(400).send({
                "error": err.message,
            });
        }
    }
};

// GET SPECIFIC PRODUCT BY NAME
exports.getProductByNameController = async(req,res) =>{
    try{
        var temp = await Product.findOne({title: req.params.name});
        if(temp){
            var owner = await User.findOne({_id:temp.owner});
            var images = [];
            for(var j=0;j<temp.productImages.length;j++){
                images.push(
                    {
                        j: temp.productImages[j].toString('base64'),
                    }
                );
            }

            var product = {
                "id": temp._id,
                "title": temp.title,
                "description": temp.description,
                "price": temp.price,
                "quantity": temp.quantity,
                "ownerID": owner._id,
                "ownerPhoneNo": owner.phoneNo,
                "productImages": images,
            };

            res.status(200).send({
                "data": product,
            });
        }else{
            res.status(404).send({
                "error": "No such product found"
            });
        }
    }catch(e){
        if(mode === "DEVELOPMENT"){
            res.status(400).send({
                "error": err,
            });
        }else{
            res.status(400).send({
                "error": err.message,
            });
        }
    }
};


// ADD PRODUCT TO LIST
exports.addProductToList = async(req,res)=>{
    try{
        var uid = req.body.uid;
        var pid = req.body.pid;
        var listNo = req.body.listNo;
        var user = await User.findOne({_id:uid});
        var prod = await Product.findOne({_id:pid});
        if(user){
            // No need to add product in owned item list from this api as it is done in another one
            switch(listNo){
                case 1: user.purchasedItemList.push({product:prod});   // to add the product in purchased item list
                    break; 
                case 2: user.shoppingCartList.push({product:prod});    // to add the product in shopping cart list
                    break;
                case 3: user.favouriteItemList.push({product:prod});   // to add the product in favorite item list
                    break;  
                default:
                    break;
            }
            await user.save();
            res.status(200).send({
                "message": "Product added successfully!"
            })
        }else{
            res.status(404).send({"error": "User not found"})
        }
    }catch(err){
        if(mode === "DEVELOPMENT"){
            res.status(400).send({
                "error": err.message,
            });
        }else{
            console.log(err);
            res.status(400).send({
                "error": err.message,
            });
        }
    }
}

// REMOVE PRODUCT FROM LIST
exports.removeProductFromList = async(req,res)=>{
    try{
        var uid = req.body.uid;
        var pid = req.body.pid;
        var listNo = req.body.listNo;
        var user = await User.findOne({_id:uid});
        if(user){
            switch(listNo){
                case 1: user.ownedItemList = user.ownedItemList.filter((data)=>data._id != pid);   // to remove the product in owned item list
                    break;
                case 2: user.purchasedItemList = user.purchasedItemList.filter((prod)=>prod.product != pid);    // to remove the product in purchased item list
                    break; 
                case 3: user.shoppingCartList = user.shoppingCartList.filter((prod)=>prod.product != pid);     // to remove the product in shopping cart list
                    break;
                case 4: user.favouriteItemList = user.favouriteItemList.filter((prod)=>prod.product != pid);    // to remove the product in favorite item list
                    break;  
                default:
                    break;
            }
            await user.save();
            res.status(200).send({
                "message": "Product removed successfully!"
            })
        }else{
            res.status(404).send({"error": "User not found"})
        }
    }catch(err){
        if(mode === "DEVELOPMENT"){
            res.status(400).send({
                "error": err,
            });
        }else{
            res.status(400).send({
                "error": err.message,
            });
        }
    }
}