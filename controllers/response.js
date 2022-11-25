const {createRespondent}  = require("../controllers/respondent");
const Response = require("../models/Response");
exports.createResponse= async(req, res, next)=>{
    try{
        const {name,phoneNo,region, zone, woreda, kebele}=req.body
        const respondent= await createRespondent({name, phoneNo, region, zone, woreda, kebele}); 
        const response = await Response.bulkCreate([
          ...req.body.response.map((item)=>{return { respondentId:respondent.id,...item}})
        ]);
        res.status(201).json({...respondent.dataValues, response});
    }catch(e){
      res.status(500).json({msg:"Faild to save response", error:e.toString()})
    }
  
} 