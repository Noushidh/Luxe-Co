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
  }
}, {
  timestamps: true // auto-creates created_at & updated_at
});

const user = mongoose.model('user', userSchema);
module.exports = user;
//export to user controller