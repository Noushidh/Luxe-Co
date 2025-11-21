const admin = require("../../models/adminmodel");


const load_dashboard = (req, res) => {
    res.render('admin/layout', {
        title: "Dashboard",
        body: './dashboard'
    });
}


module.exports = {load_dashboard}