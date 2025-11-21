const User = require('../../models/usermodel');
const bcrypt = require('bcryptjs')
const saltround = 10;

const loadlogin = (req, res) => {
    res.render('user/login')
}
const loadregister = (req, res) => {
    res.render('user/register')
}
const load_Forgot_Password = (req, res) => {
    res.render('user/forgot-password')
}
const otp = (req, res) => {
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
        const hashedPassword = await bcrypt.hash(password, saltround);
        const newUser = new User({ fullname: name, password_hash: hashedPassword, email: email });
        await newUser.save()

        req.flash('success', 'Send a otp in Your Email');
        return res.redirect('/user/otp')

    } catch (error) {
        console.log("error from register", error)
        req.flash("error", "Registration failed. Please try again.");
        return res.redirect("/user/register");
    }
}
const login = async (req,res,next)=>{
      try{
      const {email,password} = req.body;

      if (!email || !password) {
      req.flash("error", "Please fill all fields");
      return res.redirect("/user/login");
      }
      const user =await User.findOne({email});
      if(!user){
      req.flash('error', 'User does not exist');
    //   res.status(401).json({ok:false,msg:"user not found",user:userDetiles,redirect:"/login"})
      return res.redirect('/user/login')
      }
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if(!isMatch){
      req.flash('error', 'Invalid Credentials');
      return res.redirect('/user/login')
      }
      req.session.user = user;
      req.flash("success", "Login successful!");
      return res.redirect("/user/home");
      }catch(error){
        console.log("error from login")
      }
}
module.exports = { loadlogin, loadregister, load_Forgot_Password, otp, register ,login }

