const express = require('express');
const contactRoute = express.Router();
const contactController = require('../controllers/contactController');
// const { isAuth } = require('../middleware/auth');

contactRoute.get('/contact', contactController.getContact);
contactRoute.post('/contact', contactController.sendContact);
// contactRoute.get('/', contactController.getPersonalPost);
// contactRoute.post('/post/:id', contactController.updatePost);
// postRoute.post('/post/:id', postController.deletePost);

module.exports = contactRoute;
