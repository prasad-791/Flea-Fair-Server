const User = require('../../models/user');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const multer = require('multer');
const gridFsStorage = require('multer-gridfs-storage');
const gridStream = require('gridfs-stream');
const sharp = require('sharp');

require('dotenv').config();

const mode = process.env.mode

// Update Usernmae Controller
exports.updateUsernameController= async(req,res)=>{
    try{
        var bodyUsername = req.body.username;
        var user = await User.findOne({_id: req.params.id});
        if(user){
            user.username = bodyUsername,
            await user.save();
            res.status(200).send({
                "data": bodyUsername,
                "message": "Username Updated Successfully!",
            });
        }else{
            res.status(404).send({
                "error": "User doesn't exist",
            })
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

// Update Password Controller
exports.updatePasswordController = async(req,res)=>{
    try{
        var paramID = req.params.id;
        var bodyPassword = req.body.password;
        var user = await User.findOne({_id: paramID});
        if(user){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(bodyPassword,salt);
            user.password = hashedPassword;
            await user.save();
            res.status(200).send({
                "message": "Password Updated Successfully!",
            })
        }else{
            res.status(404).send({
                "error":"User doesn't exist",
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

// Update or Add Profile Image of the User
exports.uploadProfileImage = async(req,res)=>{
    try{
        // console.log(req.body)
        // return ;
        const buffer = await sharp(req.file.buffer).png().toBuffer();
        var user = await User.findOne({_id:req.params.id});
        if(user){
            user.profileImg = buffer;
            await user.save();
            res.status(200).send({
                "message": "Image saved succesfully",
                "data": user
            });
        }else{
            res.status(404).send({"error":"Cannot find User"});
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