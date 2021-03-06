const express = require('express');
const checkAuth = require('./middleware/auth');
const upload = require('./middleware/uploadImage');
const User = require('../models/user');
require('dotenv').config();

// controllers
const userController = require('./controllers/userController');
const updateUserController = require('./controllers/updateUserController');

const router = express.Router();

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

// Upload or Update User Profile Image/Avatar
router.patch('/uploadimage/:id',checkAuth,upload.single('file'),updateUserController.uploadProfileImage,(err,req,res,next)=>{
    res.status(400).send({error:err.message});
});

// Get User Profile Image/Avatar
router.get('/getImage/:id',checkAuth,userController.getProfileImageController,(err,req,res,next)=>{
    res.status(400).send({error:err.message});
});


module.exports = router;