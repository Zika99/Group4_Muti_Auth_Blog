const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
const mailgun = require('mailgun-js');
const _ = require('lodash');
const DOMAIN = 'sandboxb81adb88d8ce413f8eebc3c0aadd6419.mailgun.org';
const mg = mailgun({
  apiKey: process.env.MAILGUN_APIKEY,
  domain: DOMAIN,
});

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '', username: '' };

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

exports.index = async (req, res) => {
  res.render('index');
};

exports.about = async (req, res) => {
  res.render('aboutus');
};

// exports.preview = async (req, res) => {
//   res.render('preview');
// };

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
    // res.redirect('/');
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
  // res.send("user login");
};

// signUp functionality
exports.signup = async (req, res) => {
  const { email, password, username } = req.body;
  try {
    const user = await User.create({ email, password, username });
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    // res.redirect('/');
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
  res.status(200).render('login.ejs');
};

exports.getForgotPassword = (req, res) => {
  res.render('forgotpassword');
};

exports.forgotPassword = async (req, res) => {
  console.log('userrrrr');
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.send('user not found');
  }
  const token = user.createPasswordResetToken();
  console.log(token);
  user.resetPasswordToken = token;
  await user.save();
  // res.status(200).json({
  //   status: 'success',
  //   message: 'Token sent to email!',
  // });
  try {
    const data = {
      from: MAILGUN_FROM,
      to: EMAIL_USER,
      subject: 'reset your password',
      // text: "Testing some Mailgun awesomness!",
      html: `
      <h2>Please copy the given link to activate your account</h2>
      <p>${req.headers.host}/reset-password/${token}<p>
      `,
    };

    mg.messages().send(data, function (error, body) {
      console.log(body);
      if (error) {
        return res.json({
          error: error.message,
        });
      }
      res.render('emailsent.ejs');
      // return res.json({
      //   message: 'Email has been sent, kindly follow your instructions',
      // });
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });
    res.send(err);
  }
};

exports.getResetPassword = (req, res) => {
  User.findOne(
    { resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } },
    function (err, user) {
      if (!user) {
        //  req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot-password');
      }
      res.render('resetpassword', { token: req.params.token });
    }
  );
};

exports.resetPassword = async (req, res) => {
  // const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  // console.log(hashedToken);
  console.log(req.params.token);
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    console.log(user);
    if (!user) {
      return res.send('no user found');
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    console.log(user);
    await user.save();
    res.render('passwordChanged');
    // res.json({ success: 'password updated' });
  } catch (e) {
    res.send(e);
  }
};
