
const express = require('express')
const router = express.Router();
const admincontrollerAuth = require('../controller/admincontroller/admin.auth');
const admindashboard = require('../controller/admincontroller/admin.dashboard');
const admincustomers = require('../controller/admincontroller/admin.customers')

router.get('/login',admincontrollerAuth.loadlogin)
router.post('/login',admincontrollerAuth.login)

router.get('/dashboard',admindashboard.load_dashboard)
router.get('/customers',admincustomers.load_customers)

module.exports=router;