
const User = require("../models/User")
const sendEmail = require("../utils/sendEmail");
const sendSMS = require('../utils/sendSMS');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (user) {
      return res.status(400).json({ msg: `User is already exist with id=${req.body.email}`, user });
    }
    bcrypt.hash("moges1234", 10, (err, hash) => {
      if (err) {
        return res.status(500).json({ error: err.toString() })
      } else {

        User.create({
          name: "Alemayehu Moges",
          password: hash,
          email: "bgetaye21@gmail.com",
          phoneNo: "975752668"
        }).then((user) => {
          res.status(201).json({ name: user.name, email: user.email, phoneNo: user.phoneNo });
        });

      }
    })


  } catch (e) {
    console.log(e);
    res.status(400).json({ 'msg': e.toString() });
  }
}

exports.login = async (req, res) => {
  try {

    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      return res.status(404).json({ msg: "Faild to login" });
    }

    bcrypt.compare(req.body.password, user.password, function (err, resp) {
      if (err) {
        // handle error
        return res.status(400).json({ error: err })
      }
      if (resp) {
        // Send JWT
        const token = jwt.sign({...user.dataValues}, process.env.Access_TOKEN_SECURE);
        res.status(200).json({ token, name: user.name, email: user.email, phoneNo: user.phoneNo })

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

exports.forgotPassword = async (req, res, next) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ msg: `User not found with email=${email}` });
    }
    const token = Math.floor(100000 + Math.random() * 900000);
    user.resetToken = token;
    await user.save();
     await sendEmail();
    await sendEmail(user.email, "Password Reset", `${token}`);
    res.status(200).send(`We have sent email to ${user.email}`);
  } catch (e) {
    res.status(400).send(e.toString());
  }

};

exports.verifyToken = async (req, res, next) => {
  const { tokenCode, email } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(404).json({ msg: `User not found with email=${email}` });
  }
  //it should be compared by jwt
  if (!tokenCode === user.resetToken) {
    return res.status(400).json({ msg: 'invalid or expired token' })
  }
   user.resetToken='';
  await user.save();
  const token = jwt.sign({ ...user.dataValues }, process.env.Access_TOKEN_SECURE);
  res.status(200).json({ token, name: user.name, email: user.email, phoneNo: user.phoneNo })
  // let it loign 
};


exports.resetForgotPassword = async (req, res, next) => {
  try{
    const { newPassword } = req.body;
  const user = await User.findByPk(req.user.id);
  if(!user) return res.status(404).json({msg:"faild", user: req.user});
  bcrypt.hash(newPassword, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({ error: err.toString() })
    } else {
      user.password = hash;
      user.save().then((user) => {
        return res.status(200).json({ msg:"Password is changed successfully"});
      });

    }
  })
  }catch(e){
   res.status(400).json({error:e})
  }

};

exports.sendSMS1= async (req,res)=>{
  try{
    sendSMS("+251975752668","Test 123");
    res.send("Working good");
  }
  catch(e){
    console.log("faild to send email 🙌", e)
  }
}