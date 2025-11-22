
const express = require('express')
const router = express.Router();
const adminAuth = require("../middleware/adminAuth")

const adminAuthController  = require('../controller/admincontroller/admin.auth');
const admindashboard = require('../controller/admincontroller/admin.dashboard');
const admincustomers = require('../controller/admincontroller/admin.customers')

router.get('/login',adminAuth.isLoggin,adminAuthController.loadlogin)
router.post('/login',adminAuth.isLoggin,adminAuthController.login)

router.get('/dashboard',adminAuth.checkSession,admindashboard.load_dashboard)
router.get('/customers',adminAuth.checkSession,admincustomers.load_customers)

router.get('/logout',adminAuth.checkSession,adminAuthController.isLogout)
module.exports=router;