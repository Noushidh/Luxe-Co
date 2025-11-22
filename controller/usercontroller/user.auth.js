const User = require('../../models/usermodel');
const bcrypt = require('bcryptjs');
const saltround = 10;

const sendverificationEmai = require('../../config/nodemailer');
const { generateOtp } = require("../../public/utils/otp");

const loadlogin = (req, res) => {
    res.render('user/login')
}
const loadregister = (req, res) => {
    res.render('user/register')
}
const load_Forgot_Password = (req, res) => {
    res.render('user/forgot-password')
}
const load_otp = (req, res) => {
    res.render('user/otp')
}
const register = async (req, res, next) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        if (!name || !email || !password || !confirmPassword) {
            req.flash('error', 'All fields are required');
            return res.redirect('/user/register')
        }
        if (password !== confirmPassword) {
            req.flash('error', 'Passwords do not match');
            return res.redirect('/user/register')
        }
        const userExist = await User.findOne({ email });
        if (userExist) {
            req.flash('error', 'User already exists');
            return res.redirect('/user/register')
        }
        const otp = generateOtp();
        const emailSent = await sendverificationEmai(email, otp)

        if (!emailSent) {
            req.flash('error', 'Failed to send OTP');
            return res.redirect('/user/register');
        }

        req.session.otp = otp;
        req.session.userData = { name, email, password }

        req.flash('success', 'Send a otp in Your Email');
        console.log("OTP Sent", otp);
        return res.redirect('/user/otp')

    } catch (error) {
        console.log("error from register", error)
        req.flash("error", "Registration failed. Please try again.");
        return res.redirect("/user/register");
    }
}
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            req.flash("error", "Please fill all fields");
            return res.redirect("/user/login");
        }
        const user = await User.findOne({ email });
        if (!user) {
            req.flash('error', 'User does not exist');
            return res.redirect('/user/login')
        }
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            req.flash('error', 'Invalid Credentials');
            return res.redirect('/user/login')
        }
        req.session.user = user;
        req.flash("success", "Login successful!");
        return res.redirect("/user/home");
    } catch (error) {
        console.log("error from login")
    }
}

const Verifyotp = async (req, res) => {
    try {
        const { otp } = req.body;
        console.log("User OTP:", otp);
        console.log("Session OTP:", req.session.otp);
        if (String(otp) === String(req.session.otp)) {
            const { name, email, password } = req.session.userData
            const hashedPassword = await bcrypt.hash(password, saltround);
            const newUser = new User({ fullname: name, email: email, password_hash: hashedPassword, isVerified: true });
            await newUser.save()

            req.session.otp = null;
            req.session.userData = null;

            req.flash('success', 'User created Successfully');
            return res.json({ success: true, redirect: "/user/login" });

        } else {
            return res.json({ success: false, message: "Invalid OTP, please try again" });
        }

    } catch (error) {
        console.log("error from Verifying otp", error);
        req.flash('error', 'Something went wrong');
        return res.json({ success: false, message: "Server error" });
    }
}

module.exports = { loadlogin, loadregister, load_Forgot_Password, load_otp, register, login, Verifyotp }
//register
// const hashedPassword = await bcrypt.hash(password, saltround);
// const newUser = new User({ fullname: name, password_hash: hashedPassword, email: email });
// await newUser.save()

// req.flash('success', 'Send a otp in Your Email');
// return res.redirect('/user/otp')
