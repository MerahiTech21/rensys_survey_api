const express = require("express");
const authAuthenticate= require('../middleware/authenticate');
const router = express.Router();
const {createUser, forgotPassword, login, verifyToken, resetForgotPassword, sendSMS1} = require('../controllers/auth')
router.route('/').post(createUser);
router.post('/forgot-password',forgotPassword);
router.post('/login',login);
router.post('/verify-token', verifyToken);
router.post('/reset-forgot-password', authAuthenticate,resetForgotPassword)
router.get('/send-sms', sendSMS1)
module.exports = router;   