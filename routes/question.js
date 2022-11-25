const express = require("express");
const {createQuestion, getQuestions} = require("../controllers/question")
const router = express.Router();

router.route('/').post(createQuestion);
router.route('/:surveyId').get(getQuestions);

module.exports = router;  