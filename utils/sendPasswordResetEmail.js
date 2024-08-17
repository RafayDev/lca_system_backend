import nodemailer from 'nodemailer';
import mg from 'nodemailer-mailgun-transport'

const auth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY, // Your Mailgun API key from environment variables
    domain: process.env.MAILGUN_DOMAIN, // Your Mailgun domain from environment variables
  },
};

const transporter = nodemailer.createTransport(mg(auth));

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
