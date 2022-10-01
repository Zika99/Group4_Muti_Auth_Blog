const express = require('express');
const userRoute = express.Router();
const controller = require('../controllers/userController');
const { isAuth } = require('../middleware/auth');

// signup API route
userRoute.post('/signup', controller.signup);
userRoute.get('/signup', controller.signUp);

// signin API route
userRoute.post('/signin', controller.signin);
userRoute.get('/signin', controller.signIn);

module.exports = userRoute;
