const User = require('../models/user.js');
const jwt = require('jsonwebtoken');

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { firstName: '', lastName: '', email: '', password: '' };

  // incorrect email
  if (err.message === 'Unable to login') {
    errors.email = 'Invalid email or password';
  }

  // incorrect email
  if (err.message === 'Unable to login') {
    errors.password = 'Invalid email or password';
  }
  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('User validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

// creates json web token which will be used for authentication
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

// signIn functionality
exports.signin = async (req, res) => {
  const { email, password } = req.body;

  console.log(email, password);
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id, token });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
  // res.send("user login");
};

// signUp functionality
exports.signup = async (req, res) => {
  const { firstName, lastName, email, password, date_of_birth } = req.body;
  try {
    const user = await User.create({ firstName, lastName, email, password, date_of_birth });
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
    // res.status(400).json(err);
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
  // res.send("hello");
};

exports.signUp = (req, res) => {
  res.status(200).render('signup.ejs');
};

exports.signIn = (req, res) => {
  res.status(200).render('signin.ejs');
};
