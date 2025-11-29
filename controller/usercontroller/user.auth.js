import User from "../../models/usermodel.js";
import bcrypt from "bcryptjs";
import sendverificationEmail from "../../config/nodemailer.js";
import { generateOtp } from "../../public/utils/otp.js";
const saltround = 10;

export const loadlogin = (req, res) => {
    res.render('user/login')
}
export const loadregister = (req, res) => {
    res.render('user/register')
}
export const load_Forgot_Password = (req, res) => {
    res.render('user/forgot-password')
}
export const load_otp = (req, res) => {
    res.render('user/otp', { otpExpires: req.session.otpExpires || 0 })
}
export const load_reset_password = (req, res) => {
    res.render('user/reset-password')
}
export const page_404 = (req, res) => {
    res.render("user/layout", {
        title: "Page Not Found",
        body: "user/page-404"
    });
}

export const login = async (req, res, next) => {
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

        console.log("error from login", error)

    }
}


export const register = async (req, res, next) => {
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
        const emailSent = await sendverificationEmail(email, otp)

        if (!emailSent) {
            req.flash('error', 'Failed to send OTP');
            return res.redirect('/user/register');
        }

        req.session.otp = otp;
        req.session.otpExpires = Date.now() + 60 * 1000;
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


export const Verifyotp = async (req, res) => {
    try {
        const { otp } = req.body;

        let storedOtp = req.session.otp || req.session.forgotOtp;

        if (!storedOtp || !req.session.otpExpires) {
            return res.json({ success: false, message: "OTP expired. Please resend a new OTP." });
        }


        if (Date.now() > req.session.otpExpires) {
            return res.json({ success: false, message: "OTP expired. Please resend a new OTP." });
        }

        if (String(otp) !== String(storedOtp)) {
            return res.status(400).json({ success: false, message: "Invalid OTP , please try again" })
        }
        //registration
        if (req.session.userData) {
            const { name, email, password } = req.session.userData

            const hashedPassword = await bcrypt.hash(password, saltround);
            const newUser = new User({ fullname: name, email: email, password_hash: hashedPassword, isVerified: true });
            await newUser.save()

            req.session.otp = null;
            req.session.otpExpires = null;
            req.session.userData = null;

            req.flash('success', 'User created Successfully');
            return res.json({ success: true, redirect: "/user/login" });

        }
        //forgotpassword
        else if (req.session.forgotEmail) {
            return res.json({ success: true, redirect: "/user/reset-password" })
        }

        res.status(400).json({ success: false, message: "Invalid OTP, please try again" });

    } catch (error) {

        console.log("error from Verifying otp", error);
        res.status(500).json({ success: false, message: "Server error" });

    }
}

export const resendOTP = async (req, res) => {
    try {
        let email;

        // CASE 1: Registration OTP
        if (req.session.userData && req.session.userData.email) {
            email = req.session.userData.email;
        }

        // CASE 2: Forgot Password OTP
        else if (req.session.forgotEmail) {
            email = req.session.forgotEmail;
        }

        // If NO email found in session → error
        else {
            return res.status(400).json({
                success: false,
                message: "Session expired. Please enter your email again."
            });
        }

        const otp = generateOtp();
        req.session.otp = otp;
        req.session.otpExpires = Date.now() + 60 * 1000;
        const emailSent = await sendverificationEmail(email, otp);

        if (emailSent) {
            console.log("Resend otp", otp)
            return res.status(200).json({ success: true, message: "OTP Resend Successfully", otpExpires: req.session.otpExpires })
        } else {
            return res.status(500).json({ success: false, message: "Failed to resend OTP.Please try again" })
        }
    } catch (error) {

        console.error("Error resending otp", error)
        return res.status(500).json({ success: false, message: "Inernal Server Error. Please try again" })

    }
}

export const fogotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ success: false, message: "email not found" })
        }
        const otp = generateOtp();

        req.session.forgotEmail = email;
        req.session.forgotOtp = otp;
        req.session.otpExpires = Date.now() + 60 * 1000;

        await sendverificationEmail(email, otp);

        console.log("forget password OTP:", otp);

        return res.json({ success: true, message: "OTP Sent Successfully", redirect: "/user/otp" })

    } catch (error) {
        console.log("forget password error", error);
        return res.status(500).json({ success: false, message: "Server error" })
    }

}

export const reset_Password = async (req, res) => {
    try {
        const { password } = req.body
        const forgotEmail = req.session.forgotEmail;
        if (!forgotEmail) {
            return res.status(404).json({ success: false, message: "Session expired. Please restart the process." });
        }
        const user = await User.findOne({ email: forgotEmail });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }
        const hashedPassword = await bcrypt.hash(password, saltround);
        user.password_hash = hashedPassword;
        await user.save();


        req.session.otp = null;
        req.session.forgotEmail = null;
        req.session.forgotOtp = null;
        req.session.otpExpires = null;

        return res.json({ success: true, message: "Password reset successful", redirect: "/user/login?reset=success" })

    } catch (error) {
        console.log("reset password error", error)
        return res.status(500).json({ success: false, message: "Server error" })
    }
}
