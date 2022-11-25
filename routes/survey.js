const express = require('express');
const router = express.Router();

const {getSurveys, getSurvey, createSurvey, deleteSurvey, updateSurvey}= require('../controllers/survey');

router.route('/').get(getSurveys).post(createSurvey);
router.route('/:id').get(getSurvey).delete(deleteSurvey).put(updateSurvey);

module.exports= router;