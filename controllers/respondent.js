const Respondent = require("../models/Respondent")

exports.createRespondent=async (resp)=>{

return await Respondent.create({
       name: resp.name,
       phoneNo:resp.phoneNo,
       region:resp.region,
       zone: resp.zone,
       woreda: resp.woreda,
       kebele: resp.kebele
    });    
}