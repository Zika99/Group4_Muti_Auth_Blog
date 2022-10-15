const express = require('express');
const postRoute = express.Router();
const postController = require('../controllers/postController');
const Post = require('../models/post');
const { isAuth } = require('../middleware/auth');

// postRoute.get('/blog', postController.getPosts);
// postRoute.get('/blog', userController.blog);

postRoute.get('/preview/:id', postController.getPersonalPost);
postRoute.post('/post', postController.createPost);
postRoute.put('/post/:id', postController.updatePost);
postRoute.get('/write', isAuth, postController.write);
// postRoute.post('/post/:id', postController.deletePost);

module.exports = postRoute;
