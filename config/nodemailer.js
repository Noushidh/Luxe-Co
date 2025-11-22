const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD
  }
});

async function sendVerificationEmail(email, otp) {
  try {
    const info = await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: "Verify your account",
      html: `<b>Your OTP: ${otp}</b>`
    });

    return info.accepted.length > 0;
  } catch (error) {
    console.log("Error Sending Email:", error);
    return false;
  }
}

module.exports = sendVerificationEmail;
