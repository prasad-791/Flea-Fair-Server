const express = require('express');
const checkAuth = require('./middleware/auth');
const uploadMiddleware = require('./middleware/upload');
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