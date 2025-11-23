
const express = require('express');
const router = express.Router();
const usercontroller = require('../controller/usercontroller/user.auth');
const Homecontroller = require('../controller/usercontroller/home.controller')
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

router.post('/user/resend-otp',usercontroller.resendOTP)

router.get('/page-404',usercontroller.page_404)
router.get('/home',Homecontroller.HomePage_load)
router.get('/about',Homecontroller.AboutPage_load)
router.get('/shop',Homecontroller.ShopPage_load)
router.get('/contact',Homecontroller.ContactPage_load)
module.exports=router;

