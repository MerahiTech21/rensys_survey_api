const express = require("express");
const router = express.Router();
const {createUser, forgotPassword} = require('../controllers/auth')
router.route('/').post(createUser);
router.post('/forgot-password',forgotPassword);

module.exports = router;