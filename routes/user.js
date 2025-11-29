
import express from "express";
import passport from "passport";
const router = express.Router();
import * as usercontroller from "../controller/usercontroller/user.auth.js";
import * as Homecontroller from "../controller/usercontroller/home.controller.js";

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
.post(usercontroller.fogotPassword)

router
.route('/otp')
.get(usercontroller.load_otp)
.post(usercontroller.Verifyotp)
router.post('/resend-otp',usercontroller.resendOTP)

router
.route('/reset-password')
.get(usercontroller.load_reset_password)
.post(usercontroller.reset_Password)

router.get("/google",passport.authenticate("google",{scope:["profile","email"]}))
router.get("/google/callback",passport.authenticate("google", { failureRedirect: "/user/login" }),(req, res) => {res.redirect("/user/home");});


router.get('/page-404',usercontroller.page_404)
router.get('/home',Homecontroller.HomePage_load)
router.get('/about',Homecontroller.AboutPage_load)
router.get('/shop',Homecontroller.ShopPage_load)
router.get('/contact',Homecontroller.ContactPage_load)

export default router;
