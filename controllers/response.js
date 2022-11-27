const { createRespondent } = require("../controllers/respondent");
const Question = require("../models/Question");
const Respondent = require("../models/Respondent");
const Response = require("../models/Response");
const ResponseChoice = require("../models/ResponseChoice");

exports.createResponse = async (req, res, next) => {
  try {
    const { name, phoneNo, region, zone, woreda, kebele } = req.body
    const respondent = await createRespondent({ name, phoneNo, region, zone, woreda, kebele });
    const response = await Response.bulkCreate([
      ...req.body.response.map((item) => { return { respondentId: respondent.id, ...item } })
    ]);
    res.status(201).json({ ...respondent.dataValues, response });
  } catch (e) {
    res.status(500).json({ msg: "Faild to save response", error: e.toString() })
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
        let choices = question.responseChoice.map((item) => item.text);
        for (let choice of choices) {
          count[choice] = count[choice] || 0;
        }
      }
      summary.push({ text: question.text, type: question.type, order: question.order, require: question.require, responses: count })
    });
    res.status(200).json(summary);


  } catch (e) {

  }
}