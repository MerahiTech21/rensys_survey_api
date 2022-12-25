const express= require('express');
const authAuthenticate= require('../middleware/authenticate');
const { resetPassword, forgotPassword, verifyToken, resetForgotPassword } = require('../controllers/encoder-auth');
const {createEncoder, getEncoders, deleteEncoder, updateEncoder, assignSurvey, getEncoderResponses, login}= require("../controllers/encoder");

const router= express.Router();
router.route('/').post(createEncoder);
router.route('/').get(getEncoders);
router.route('/:id/responses').get(getEncoderResponses);
router.route("/:id").put(updateEncoder);
router.route("/assign-survey/:id").put(assignSurvey);
router.route("/:id").delete(deleteEncoder);
router.route("/login").post(login);
router.post('/forgot-password',forgotPassword);
router.put('/password-reset',authAuthenticate, resetPassword);
router.post('/verify-token', verifyToken);
router.post('/reset-forgot-password', authAuthenticate,resetForgotPassword)

module.exports= router;       