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
const sendWelcomeEmail = async (email, name, password) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to Lahore CSS Academy',
    text: `Dear ${name},\n\nWelcome to Lahore CSS Academy! \n\nYour username is ${email} and your password is ${password} is your password. We are excited to have you on board.\n\nBest regards,\nLahore CSS Academy`,
    
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

export { sendWelcomeEmail };
