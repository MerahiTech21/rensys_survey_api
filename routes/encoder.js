const express= require('express');
const {createEncoder, getEncoders, deleteEncoder, updateEncoder, assignSurvey, getEncoderResponses}= require("../controllers/encoder");

const router= express.Router();
router.route('/').post(createEncoder);
router.route('/').get(getEncoders);
router.route('/:id/responses').get(getEncoderResponses);
router.route("/:id").put(updateEncoder);
router.route("/assign-survey/:id").put(assignSurvey);
router.route("/:id").delete(deleteEncoder);
module.exports= router; 