const express = require('express');
const checkAuth = require('./middleware/auth');
const uploadMiddleware = require('./middleware/upload');
const upload = require('./middleware/uploadProfileImage');
const User = require('../models/user');
require('dotenv').config();

// controllers
const userController = require('./controllers/userController');
const updateUserController = require('./controllers/updateUserController');

const router = express.Router();

const SECRET_KEY = 'JWTSECRETKEY';

// token example : sending token through headers.authorization
router.get('/', checkAuth,(req, res) => {
    res.send({ appName: "Flea Fair" });
    console.log(req.userData);
});

// Register New User
router.post('/register', userController.registerController);

// Verified Email Changes
router.get('/verify-email',userController.emailVerificationController);

// Log In Existing User
router.post('/login', userController.loginController);

// Log out
router.get('/logout',checkAuth,userController.logoutController);

// Update Username
router.route('/updateusername/:id').patch(checkAuth,updateUserController.updateUsernameController);

//Update Password
router.patch('/updatepassword/:id',checkAuth,updateUserController.updatePasswordController);

//Update Image
router.patch('/updateimage/:id',checkAuth,uploadMiddleware.single('file'),updateUserController.updateProfileImage);

// Get Profile Image
router.get('/getprofileimg/:filename',userController.getProfileImageController);
module.exports = router;

router.post('/uploadimage/:id',checkAuth,upload.single('file'),updateUserController.uploadProfileImage,(err,req,res,next)=>{
    res.status(400).send({error:err.message});
});

router.get('/getImage/:id',checkAuth,async(req,res)=>{
    var user = await User.findOne({_id:req.params.id});
    var image = user.profileImg.toString('base64');
    if(user){
        res.send({
            data: image,
        });
    }else{
        res.params.send({error:"No user found"});
    }
});