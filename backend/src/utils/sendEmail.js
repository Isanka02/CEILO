// Configure email sending here when ready
// npm install nodemailer
// import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, text }) => {
  console.log(`Email sent to ${to}: ${subject}`);
  // TODO: implement nodemailer
};

export default sendEmail;