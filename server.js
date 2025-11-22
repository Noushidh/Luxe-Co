require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const connectDB = require('./db/connectDB')
const session = require('express-session')
const flash = require('connect-flash');
const nocache = require('nocache');

const port = process.env.PORT||5000;
const SESSION_SECRET = process.env.SESSION_SECRET;
app.set("view engine","ejs");
app.set('views',path.join(__dirname,'views'))
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(nocache())

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure:false,
        httpOnly:true,
        maxAge: 1000 * 60 * 60
    }
}))

app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});


const userRoutes = require('./routes/user')
const adminRoutes = require('./routes/admin')
app.use('/user',userRoutes)
app.use('/admin',adminRoutes)

app.get("/", (req, res) => {
    res.redirect("/user/login")
})

connectDB();
app.listen(port,()=>{
   console.log("http://localhost:5000/")
});








