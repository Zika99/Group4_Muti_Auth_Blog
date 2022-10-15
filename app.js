const express = require('express');
require('dotenv').config();
require('./db/mongoose');
require('./routes/authRoute');
const passport = require('passport');
const userRoute = require('./routes/userRoute');
const session = require('express-session');
// const googleAuth = require('./routes/googleauth');
const postRoute = require('./routes/postRoute');
const contactRoute = require('./routes/contactRoute');
const Post = require('./models/post');
const cookieParser = require('cookie-parser');
const { checkUser } = require('./middleware/auth');

// initialize your express app
const app = express();

// initializing ejs engine
app.set('view engine', 'ejs');

// middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({ secret: process.env.SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
// app.use(googleAuth);

// routes
app.get('*', checkUser);

// app.get('/signup', (req, res) => {
//   res.send('<a href="/auth/google">Authenticate with Google</a>');
// });
// app.get('/signup', (req, res) => {
//   res.send('<a href="/auth/google">Authenticate with Google</a>');
// });

app.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

app.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: '/blog',
    failureRedirect: '/google/failure',
  })
);

app.get('/google/failure', (req, res) => {
  res.send('Failed to authenticate..');
});

app.get('/google/failure', (req, res) => {
  res.send('Failed to authenticate..');
});

app.get('/blog', async (req, res) => {
  const articles = await Post.find().sort({ createdAt: 'desc' });
  // res.send(articles);
  res.render('blog', { articles: articles });
});

app.use('/', postRoute);
app.use('/', userRoute);
app.use('/', contactRoute);

app.use((req, res) => {
  res.status(404).render('404');
});

// assign a port
port = process.env.PORT || 7000;

// running the server
app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});

// (from = req.body.from), (subject = req.body.subject), (message = req.body.body);
