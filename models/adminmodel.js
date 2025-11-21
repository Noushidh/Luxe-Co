

const mongoose = require('mongoose');

const adminschema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password_hash: {
    type: String,
    required: true
     }
})

const admin = mongoose.model('Admin', adminschema)
module.exports = admin;
//export to admin controller