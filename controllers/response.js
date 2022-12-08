const { createRespondent } = require("../controllers/respondent");
const Question = require("../models/Question");
const Respondent = require("../models/Respondent");
const Response = require("../models/Response");
const ResponseChoice = require("../models/ResponseChoice");

exports.createResponse = async (req, res, next) => {
  try {
    const { name, phoneNumber, region, zone, woreda, kebele } = req.body.userData;
    // const respondent = await createRespondent({ name, phoneNo:phoneNumber, region, zone, woreda, kebele });


    const respondent =   await Respondent.create({
       name,
      phoneNo:phoneNumber,
      region,
       zone,
       woreda,
       kebele,
       surveyId:req.body.surveyId
   });   
    // req.body.questionResponses
   let responses= []
   req.body.questionResponses.forEach((response)=>{
   if(response.multipleAnswer?.length>0){
     response.multipleAnswer?.forEach((ans)=>{
       
       responses.push({
        respondentId:respondent.id,
        questionId: response.questionId,
         answer:ans
       } )

      }    
    ); 
    return;
   }
    responses.push({respondentId:respondent.id, answer: response.answer, questionId: response.questionId});
   });

    const response = await Response.bulkCreate(
      responses
      // ...req.body.response.map((item) => { return { respondentId: respondent.id, ...item } })
  );
    res.status(201).json({ ...respondent.dataValues, response });
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: "Faild to save response", error: e.toString() })
  }

}

exports.getIndividualResponse = async (req, res, next) => {
  try {
    const individualResponse = await Respondent.findAll({
      include: { model: Question, include: [{ model: Response }, { model: ResponseChoice }] }
    })
    res.status(200).json(individualResponse);
  } catch (e) {
    res.status(500).json({ msg: "Faild to fetch individual response", error: e.toString() })
  }
}

exports.getResponseSummary = async (req, res, next) => {
  try {
    const questions = await Question.findAll({
      Where: { surveyId: req.params.surveryId },
      include: [{ model: Response, attributes: ['answer'] }, {model:ResponseChoice, attributes:['text']}]
    });

    let summary = [];
    questions.forEach(question => {
      let responses = question.responses.map((item) => item.answer);

      let count = {};
      responses.forEach(function (i) { count[i] = (count[i] || 0) + 1; });

      if (question.type != "short") {
        let choices = question.responseChoices.map((item) => item.text);
        for (let choice of choices) {
          count[choice] = count[choice] || 0;
        } 
      } 
      summary.push({ text: question.text, type: question.type, order: question.order, require: question.require, responses: count })
    });
    res.status(200).json(summary);


  } catch (e) {
     res.status(400).json({error:e.toString()});
  }
}