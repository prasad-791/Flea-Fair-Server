const User = require('../../models/user');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const multer = require('multer');
const gridFsStorage = require('multer-gridfs-storage');
const gridStream = require('gridfs-stream');

require('dotenv').config();

// Update Usernmae Controller
exports.updateUsernameController= async(req,res)=>{
    try{
        var bodyUsername = req.body.username;
        var user = await User.findOne({_id: req.params.id});
        if(user){
            user.username = bodyUsername,
            await user.save();
            res.status(200).send({
                username: bodyUsername,
                message: "Username Updated Successfully!",
            });
        }else{
            res.status(404).send({
                error: "User doesn't exist",
            })
        }
    }catch(err){
        console.log(err);
        res.status(404).send({
            error: err.message,
        });
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
                message: "Password Updated Successfully!",
            })
        }else{
            res.status(404).send({
                error:"User doesn't exist",
            });
        }
    }catch(err){
        console.log(err);
        res.status(404).send({
            error:err.message,
        })
    }
};

// Update or Add Profile Image of the User
exports.updateProfileImage = async(req,res)=>{
    try {

        var paramID = req.params.id;
        var user = await User.findOne({_id:paramID});
        if(user){

            if(req.file === undefined){
                return res.status(404).send({message:"File Not Found!"});
            }
            const imgUrl = `http://${req.headers.host}/file/${req.file.filename}`;
            return res.send({
                url: imgUrl,
                file: req.file
            });
    
        }else{
            res.status(404).send({
                error: "User doesn't exist",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(404).send({
            error: error.message,
        });
    }
};