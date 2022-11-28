
const User = require("../models/User")
const sendEmail = require("./utils/sendEmail");
const sendSMS = require('./utils/sendSMS');
exports.createUser = async (req, res, next) =>{
    try{
      const user = await User.create({
        name:"Alemayehu Moges",
        password:"",
        email:"bgetaye21@gmail.com",
        phoneNo:"975752668"
      });
      res.status(201).json(user);
    }catch(e){
        console.log(e);
        res.status(400).json({'msg':e.toString()});
    }
}
exports.forgotPassword= async (req, res, next)=>{
  try{
    const email =req.body.email;
  const user = await User.findOne({where:{email}});
  if(!user){ 
    return res.status(404).json({msg:`User not found with email=${email}`});
  }
  const token= Math.floor(100000 + Math.random() * 900000);
  user.resetToken= token;
  await user.save();
   
  await sendEmail(user.email,"Password Reset", `${token}`);
  // await sendSMS('+251975752668',"Here we go")
  res.status(200).send(`We have sent email to ${user.email}`);
  }catch(e){
    res.status(400).send(e.toString());
  }
  
};

exports.verifyToken = async (req, res, next) =>{
   const{token, email}=req.body;
   const user = await User.findOne({where:{email}});
   if(!user){ 
     return res.status(404).json({msg:`User not found with email=${email}`});
   }
   //it should be compared by jwt
   if(!token===user.token){
    return res.status(400).json({msg:'invalid or expired token'})
   }
    // let it loign 
};

exports.resetPassword=(req, res, next) =>{
  const {password}= req.body;


};