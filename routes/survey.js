const express = require('express');
const router = express.Router();

const {getSurveys,
       getSurvey,
       createSurvey, 
       deleteSurvey, 
       updateSurvey, 
       changeSurveyStatus}= require('../controllers/survey');
    
router.route('/').get(getSurveys).post(createSurvey);
router.route('/:id').get(getSurvey).delete(deleteSurvey).put(updateSurvey);
router.route('/status/:id').put(changeSurveyStatus);
module.exports= router;