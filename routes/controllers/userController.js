const User = require('../../models/user');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
// const gfs = require('../../index');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const Product = require('../../models/product');
require('dotenv').config();

const mode = process.env.mode
const connection = mongoose.connection;

let gfs;
connection.once('open',()=>{
    gfs = Grid(connection.db,mongoose.mongo);
    gfs.collection('profileImages.files');
});

function getList(li,multiEle){
    if(multiEle === true){
        let result = [];
        for(var i=0;i<li.length;i++){
            result.push(li[i]['product']);
        }
        return result;
    }
    let result = [];
    for(var i=0;i<li.length;i++){
        result.push(li[i]['_id']);
    }
    return result;
}

function convertBuffToStr(li){
    let temp = [];
    for(var i=0;i<li.length;i++){
        let temp2 = [];
        for(var j=0;j<li[i]['productImages'].length;j++){
            temp2.push(li[i]['productImages'][j].toString('base64'));
        }
        temp.push({
            "id": li[i]._id,
            "productImages": temp2,
            "title": li[i].title,
            "description": li[i].description,
            "price": li[i].price,
            "quantity": li[i].quantity,
            "owner": li[i].owner
        })
    }
    return temp;
}

// LOGIN CONTROLLER
exports.loginController = async (req, res) => {
    try {

        User.findOne({email:req.body.email})
        .exec()
        .then(async(user)=>{
            if(user){

                if(user.isEmailVerified === false){
                    return res.status(403).send({
                        "error": "Kindly verify your email account",
                    })
                }

                bcrypt.compare(req.body.password,user.password,async(err,result)=>{
                    if(err){
                        return res.status(400).send({"error":err.message});
                    }else{
                        if(result === true){

                            var token = jwt.sign(
                                {
                                    email:user.email,
                                    userID:user._id
                                },
                                process.env.JWT_SECRET_KEY,
                                // {
                                //     expiresIn:"24hr"
                                // }
                            );
                            var image = null;
                            if(user.profileImg!=null){
                                image = user.profileImg.toString('base64');
                            }
                            
                            ownedProdIds = getList(user.ownedItemList,false);
                            purchasedProdIds = getList(user.purchasedItemList,true);
                            shopProdIds = getList(user.shoppingCartList,true);
                            favProdIds = getList(user.favouriteItemList,true);

                            ownedList = convertBuffToStr(await Product.find({"_id":{"$in":ownedProdIds}})); 
                            purchasedList = convertBuffToStr(await Product.find({"_id":{"$in":purchasedProdIds}}));
                            shopList = convertBuffToStr(await Product.find({"_id":{"$in":shopProdIds}}));
                            favList = convertBuffToStr(await Product.find({"_id":{"$in":favProdIds}}));

                            

                            res.status(200).send({
                                "message": "Logged In Successfully!",
                                "token": token,
                                "data": {
                                    id: user._id,
                                    name: user.name,
                                    username: user.username,
                                    email: user.email,
                                    phoneNo: user.phoneNo,
                                    image: image,
                                    ownedItemList: ownedList,
                                    purchasedItemList: purchasedList,
                                    shoppingCartList: shopList,
                                    favouriteItemList: favList,
                                },
                            });
                        }else{
                            res.status(403).send({"error":"Invalid Password"});
                        }
                    }
                });
            }else{
                res.status(403).send({"error":"User doesn't exist"});
            }
        })
        .catch(err=>{
            if(mode === "DEVELOPMENT"){
                res.status(400).send({
                    "error": err,
                });
            }else{
                res.status(400).send({
                    "error": err.message,
                });
            }
        })

    } catch (err) {
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


// mail sender details
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: "fleafair791@gmail.com",
        pass: "evtkrddzpywamitv",
    },
    tls:{
        rejectUnauthorized: false,
    }
});

// REGISTER / SIGN UP CONTROLLER
exports.registerController = async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            emailToken: crypto.randomBytes(64).toString('hex'),
        });
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        user.password = hashedPassword;
        const newUser = await user.save();

        //sending verificaiton mail to the user
        var mailOptions = {
            from: ' "Verify your email" <fleafair791@gmail.com>',
            to: user.email,
            subject: 'Flea Fair - Verify your email',
            html:  `<h2> ${user.name}! Thanks for registering on our app </h2>
                    <h4> Please verify your email to continue..</h4>
                    <a href="http://${req.headers.host}/user/verify-email?token=${user.emailToken}">Click to Verify</a>
            `
        }
        // sending mail
        transporter.sendMail(mailOptions,function(err,info){
            if(err){
                if(mode === "DEVELOPMENT"){
                    res.status(400).send({
                        "error": err,
                    });
                }else{
                    res.status(400).send({
                        "error": err.message,
                    });
                }
            }else{
                res.status(201).send({ 
                    "message": "User Registered Successfully! Kindly check your mail inbox and verify your account.",
                });
            }
        });

    } catch (err) {
        // console.log(err);
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

// VERIFY EMAIL CONTROLLER
exports.emailVerificationController = async(req,res)=>{
    try{
        const token = req.query.token;
        const user = await User.findOne({emailToken:token});
        if(user){
            user.emailToken = null;
            user.isEmailVerified = true;
            await user.save();
            res.status(200).send({"message":"Verification Successfull! Now you can login :)"});
        }else{
            res.status(403).send({"error":"Verification Failed!"});
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
};

exports.logoutController = async(req,res)=>{
    try{
        res.status(200).send({
            "token": '',
            "message":'Logged Out Successfully',
        });
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
};

// GET USER PROFILE IMAGE
exports.getProfileImageController = async(req,res)=>{
    var user = await User.findOne({_id:req.params.id});
    var image = user.profileImg.toString('base64');
    if(user){
        res.status(200).send({
            "data": image,
        });
    }else{
        res.status(404).send({"error":"No user found"});
    }
};