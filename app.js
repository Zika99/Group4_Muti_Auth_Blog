const express = require('express');
require('dotenv').config();
require('./db/mongoose');
const userRoute = require('./routes/userRoute');
const cookieParser = require('cookie-parser');
const { checkUser } = require('./middleware/auth');

// initialize your express app
const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// initializing ejs engine
// app.set('view engine', 'ejs');

// routes
app.get('*', checkUser);
app.use('/', userRoute);

app.use((req, res) => {
  res.status(200).send('Hello');
});
app.use((req, res) => {
  res.status(404).render('404');
});

// assign a port
port = process.env.PORT || 5000;

// running the server
app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});
