const express = require("express");
const router = express.Router();
const {createResponse} = require("../controllers/response")
router.route('/').post(createResponse);

module.exports= router;