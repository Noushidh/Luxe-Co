
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  password_hash: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["Active", "Inactive", "Banned"],
    default: "Active"
  },

  // 🔥 NEW FIELDS YOU NEED FOR TEMP STORAGE + OTP
  isVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    type: String
  },
  otpExpires: {
    type: Date
  }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
