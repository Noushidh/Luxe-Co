
import express from "express";
const router = express.Router();

import * as adminAuth from "../middleware/adminAuth.js";
import * as adminAuthController from "../controller/admincontroller/admin.auth.js";
import * as admindashboard from "../controller/admincontroller/admin.dashboard.js";
import * as admincustomers from "../controller/admincontroller/admin.customers.js";

router.get('/login',adminAuth.isLoggin,adminAuthController.loadlogin)
router.post('/login',adminAuth.isLoggin,adminAuthController.login)
router.get('/dashboard',adminAuth.checkSession,admindashboard.load_dashboard)
router.get('/customers',adminAuth.checkSession,admincustomers.load_customers)
router.get('/logout',adminAuth.checkSession,adminAuthController.isLogout)

export default router;
