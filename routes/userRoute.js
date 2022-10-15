const express = require('express');
const userRoute = express.Router();
const userController = require('../controllers/userController');
const { isAuth } = require('../middleware/auth');

// userRoute.get('/signup', controller.signUp);
userRoute.get('/', userController.index);
userRoute.get('/login', userController.signIn);
userRoute.get('/signup', userController.signUp);
userRoute.get('/aboutus', userController.about);
// userRoute.get('/preview', userController.preview);

userRoute.post('/login', userController.signin);
userRoute.post('/signup', userController.signup);
userRoute.get('/logout', userController.logout_get);
userRoute.get('/forgot-password', userController.getForgotPassword);
userRoute.post('/forgot-password', userController.forgotPassword);
userRoute.get('/reset-password/:token', userController.getResetPassword);
userRoute.post('/reset-password/:token', userController.resetPassword);

module.exports = userRoute;
