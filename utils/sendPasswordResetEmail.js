import nodemailer from 'nodemailer';

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your email address from environment variables
    pass: process.env.EMAIL_PASS, // Your email password from environment variables
  },
});

// Function to send welcome email
const sendPasswordResetEmail = async (email, password) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset',
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
    your account's new password is: ${password}\n\n `
  };

  try {
    await transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error('Error sending welcome email:', error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

export { sendPasswordResetEmail };
