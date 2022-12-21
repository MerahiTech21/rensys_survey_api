const Encoder = require("../models/Encoder");
const bcrypt = require("bcrypt");
const Survey = require("../models/Survey");
const Respondent = require("../models/Respondent");
const Response = require("../models/Response");
const ResponseChoice = require("../models/ResponseChoice");
const Question = require("../models/Question");
const { Op } = require("sequelize");

exports.createEncoder = async (req, res) => {
  try {
    const password = await bcrypt.hash("12345678",10);
    const encoder = await Encoder.create({name:req.body.name,phoneNo:req.body.phoneNo, password });
    res.status(201).json({id:encoder.id,name:encoder.name,phoneNo:encoder.phoneNo,surveyId:encoder.surveyId});
  } catch (error) {
    res.status(400).json("Error " + error);
  }
};
exports.getEncoders = async (req, res) => {
    try {
      const encoders = await Encoder.findAll({ attributes:{exclude:['password','createdAt','updatedAt']}});
      res.json(encoders);
    } catch (error) {
      res.status(400).json("Error " + error);
    }
  };
exports.updateEncoder = async (req, res) => {
  try {
    const encoder = await Encoder.findByPk(req.params.id);
    encoder.name = req.body.name;
    encoder.phoneNo = req.body.phoneNo;
    await encoder.save();
    res.status(200).json({id:encoder.id,name:encoder.name,phoneNo:encoder.phoneNo,surveyId:encoder.surveyId});
  } catch (error) {
    res.status(400).json("Error " + error);
  }
};
exports.deleteEncoder = async (req, res) => {
  try {
    const encoder = await Encoder.findByPk(req.params.id);
    await encoder.destroy();
    res.json("successfully deleted");
  } catch (error) {
    res.status(400).json("Error " + error);
  }
};

exports.assignSurvey = async (req, res) => {
  try {
    const encoder = await Encoder.findByPk(req.params.id);
    encoder.surveyId = req.body.surveyId;
    await encoder.save();
    res.status(200).json(encoder);
  } catch (error) {
    res.status(400).json("Error " + error);
  }
};
 
exports.getEncoderResponses = async (req, res, next) => {
    try {
      const encoder = await Encoder.findByPk(req.params.id)
      if (!encoder) {
        return res.status(404).json({ msg: `Couldn't find a survey with id=${req.params.id}` });
      }
      const individualResponse = await Respondent.findAll({
       required:true,
        include: {
          model: Question, 
          required:true,
          include: [
            { model: Response ,
              attributes:['answer', 'respondentId'],
              where: {
                respondentId:{ 
                  [Op.col]: 'respondent.id' 
                } 
              },
            },
            {  
              model: ResponseChoice
             }]
        },
        where: { encoderId: req.params.id }
      })
  
      res.status(200).json(individualResponse);
    } catch (e) {
      res.status(500).json({ msg: "Faild to fetch individual response", error: e.toString() })
    }
 
}

exports.login = async (req, res) => {
    try {
  
      const encoder = await Encoder.findOne({ where: { phoneNo: req.body.phoneNo } });
      if (!encoder) {
        return res.status(404).json({ msg: "Faild to login" });
      }
  
      bcrypt.compare(req.body.password, encoder.password, function (err, resp) {
        if (err) {
          // handle error
          return res.status(400).json({ error: err })
        }
        if (resp) {
          // Send JWT
          const token = jwt.sign({ ...encoder.dataValues }, process.env.ACCESS_TOKEN_SECURE);
          res.status(200).json({ token, name: encoder.name, phoneNo: encoder.phoneNo })
        } else {
          // response is OutgoingMessage object that server response http request
          return res.status(400).json({ success: false, msg: 'passwords do not match' });
        }
      });
  
    }
    catch (e) {
      res.status(404).send(e.toString())
    }
  
}
 