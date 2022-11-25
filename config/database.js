const sequelize= require('../config/db');
const {DataTypes} = require('sequelize');

const Respondent= require('../models/Respondent');
const Question= require('../models/Question');
const Response= require("../models/Response");
const ResponseChoice= require("../models/ResponseChoice");
const Survey= require("../models/Survey.js");

Survey.hasMany(Question,{onDelete:'CASCADE', onUpdate:'CASCADE',foreignKey: {
  allowNull: false
}});
Question.belongsTo(Survey);

Question.belongsToMany(Respondent, {through:Response});
Respondent.belongsToMany(Question, {through: Response});

Question.hasMany(Response, {onDelete:'CASCADE', onUpdate:'CASCADE'});
Response.belongsTo(Question);

Respondent.hasMany(Response,{onDelete:'CASCADE', onUpdate:'CASCADE'});
Response.belongsTo(Respondent);
 
Question.hasMany(ResponseChoice, {onDelete:'CASCADE', onUpdate:'CASCADE'});
ResponseChoice.belongsTo(Question);

sequelize.sync({alter:true}).then(()=>{
      console.log('re-sync is done')
  }).catch((err)=>{
    console.log('sequelize err',err);
  });