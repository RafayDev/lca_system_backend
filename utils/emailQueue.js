import async from 'async';
import { sendWelcomeEmail } from '../utils/email.js';

const emailQueue = async.queue(async (task, callback) => {
  const { email, name, randomPassword } = task;
  try {
    await sendWelcomeEmail(email, name, randomPassword);
    callback();
  } catch (error) {
    callback(error);
  }
}, 1); // Set concurrency to 1 to process one email at a time

export const addEmailToQueue = (email, name, randomPassword) => {
  emailQueue.push({ email, name, randomPassword }, (err) => {
    if (err) {
      console.error('Failed to send email:', err);
    } else {
      console.log('Email sent successfully');
    }
  });
};
