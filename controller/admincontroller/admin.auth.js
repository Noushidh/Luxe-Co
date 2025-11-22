
const Admin = require("../../models/adminmodel");
const bcrypt = require("bcryptjs")

const loadlogin = (req, res) => {
    res.render('admin/login');
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email })

        if (!admin) return res.render("admin/login", { error: "Admin not found!" });
        const isMatch = await bcrypt.compare(password, admin.password_hash);
        if (!isMatch) {
            return res.render("admin/login", { error: "Invalid Password" });
        }
        req.session.admin = admin._id;

        return res.redirect("/admin/dashboard");

    } catch (error) {
        console.log("admin login error")
        res.render("admin/login", { error: "Something went wrong!" });
    }
}

const isLogout = async (req, res, next) => {
    try {
        req.session.destroy((err) => {
            if (err) return next(err);
            res.redirect('/admin/login');
        })
    } catch (error) {
        console.log("logout error", err);
        next(err)
    }
}
module.exports = { loadlogin, login, isLogout }

