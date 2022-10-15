let nodemailer = require('nodemailer');

exports.getContact = (req, res) => {
  res.render('contact');
};

// For sending message in the contact form
exports.sendContact = (req, res) => {
  console.log(req.body);
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>First Name: ${req.body.name}</li>
      <li>Email: ${req.body.email}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 25,
    // secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USERNAME, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });
  // setup email data with unicode symbols
  let mailOptions = {
    from: req.body.email, // sender address
    to: EMAIL_TO, // list of receivers
    subject: 'Feedback form', // Subject line
    text: 'Hello world?', // plain text body
    html: output, // html body
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    // res.render('contact', { msg: 'Email has been sent' });
    res.render('contactsent');
  });
};
