import dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
import connectDB from "./config/connectDB.js";
import session from "express-session";
import flash from "connect-flash";
import nocache from "nocache";

import "./config/passport.js";
import passport from "passport";


const port = process.env.PORT||5000;
const SESSION_SECRET = process.env.SESSION_SECRET;

connectDB();


app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));
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

app.use(passport.initialize());
app.use(passport.session());

import userRoutes from "./routes/user.js";
import adminRoutes from "./routes/admin.js";

app.use('/user',userRoutes)
app.use('/admin',adminRoutes)

app.get("/", (req, res) => {
    res.redirect("/user/login")
})

app.listen(port,()=>{
   console.log("http://localhost:5000/")
});








