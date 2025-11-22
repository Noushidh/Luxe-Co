
const express = require('express');
const router = express.Router();
const usercontroller = require('../controller/usercontroller/user.auth');
const { route } = require('./admin');

router
.route('/login')
.get(usercontroller.loadlogin)
.post(usercontroller.login)

router
.route('/register')
.get(usercontroller.loadregister)
.post(usercontroller.register)

router
.route('/forgot-password')
.get(usercontroller.load_Forgot_Password)

router
.route('/otp')
.get(usercontroller.load_otp)
.post(usercontroller.Verifyotp)
module.exports=router;

