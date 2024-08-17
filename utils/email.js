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
