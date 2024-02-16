const express = require('express');
const { signup, verifyuser,login,forgotPassword,newpassword} = require('../controller/auth_controller');

const router = express.Router();

router.post("/signup",signup)
router.get("/verifyuser/:token",verifyuser)
router.post("/login",login)
router.post("/forgotpassword",forgotPassword)
router.post("/newpassword/:token",newpassword)

module.exports = router;

