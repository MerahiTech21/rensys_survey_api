const Question = require("../models/Question");
const ResponseChoice = require("../models/ResponseChoice");

exports.createQuestion = async (req, res, next) => {
   try {
      const question = await Question.create({
         text: req.body.text,
         surveyId: req.body.surveyId,
         type: req.body.type,
         order: req.body.order,
         required: req.body.required
      });
      if (req.body.type === "SINGLECHOICE" || req.body.type === "MULTIPLECHOICE") {
         const responseChoices = await ResponseChoice.bulkCreate([
            ...req.body.responseChoices.map(function (item) { return { text: item, questionId: question.id } })
         ]

         );
         res.status(201).json({ ...question.dataValues, responseChoices });
      }
      else if (req.body.type === "LINEARSCALE") {
         //GOES HERE
      }
      else {
         res.status(201).json(question);
      }


   } catch (e) {
      res.status(500).json({ msg: "Faild to create question", error: e.toString() })
   }

}

exports.getQuestions = async (req, res, next) => {
   try {
      const questions = await Question.findAll({ where:{surveyId:req.params.surveyId}, include: ResponseChoice });
      res.status(200).json(questions)
   } catch (e) {
      res.status(500).json({ msg: "Faild to fetch questions", error: e.toString() });
   }

}