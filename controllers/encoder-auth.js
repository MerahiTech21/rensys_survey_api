const Encoder = require("../models/Encoder");
const Survey = require("../models/Survey");
const sendSMS = require("../utils/sendSMS");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.resetPassword = async (req, res, next) => {

    try {
      const { oldPassword, newPassword } = req.body;
      const user = await Encoder.findOne({where:{id:req.user.id}});

      if (!user) return res.status(404).json({ msg: "faild"});
      bcrypt.compare(oldPassword, user.password, function (err, resp) {
        if (err) {
          // handle error
          return res.status(400).json({ error: err, msg:"old password doesn't match" })
        }
        if (resp) {
          // Send JWT
  
          bcrypt.hash(newPassword, 10, (err, hash) => {
            if (err) {
              return res.status(500).json({ error: err.toString() })
            } else {
              user.password = hash;
              user.save().then((user) => {
                return res.status(200).json({ msg: "Password is changed successfully" });
              });
  
            }
          })
        } else {
          // response is OutgoingMessage object that server response http request
          return res.status(400).json({ success: false, msg: 'passwords do not match' });
        }
      });
  
  
    } catch (e) {
      res.status(400).json('Errorn '+e)
    }
  
  }; 


  exports.forgotPassword = async (req, res, next) => {
    try {
      const phoneNo = req.body.phoneNo;
      const user = await Encoder.findOne({ where: { phoneNo } });
      if (!user) {
        return res.status(404).json({ msg: `User not found with phoneNo=${phoneNo}` });
      }
      const token = Math.floor(100000 + Math.random() * 900000);
      user.resetToken = token;
      await user.save();
      const extractedPhoneNumber=phoneNo.substring(0);
      const finalPhoneNumber="+251".concat(extractedPhoneNumber);
       await sendSMS(finalPhoneNumber,token);
      res.status(200).json(`We have sent phoneNo to ${user.phoneNo}`);
    } catch (e) {
      res.status(400).send(e.toString());
    }
  
  };
  
  exports.verifyToken = async (req, res, next) => {
    try {
      const { tokenCode, phoneNo } = req.body;
      const user = await Encoder.findOne({ where: { phoneNo } ,include:Survey});
      if (!user) {
        return res.status(404).json({ msg: `User not found with phone=${phoneNo}` });
      }
      //it should be compared by jwt
      if (tokenCode == user.resetToken) {
        console.log('tok',tokenCode)
        console.log('res',user.resetToken)
        user.resetToken = '';
        await user.save();
        const token = jwt.sign({ ...user.dataValues }, process.env.ACCESS_TOKEN_SECURE);
        res.status(200).json({ token, id:user.id,name:user.name, email: user.email, phoneNo: user.phoneNo ,survey:user?.survey, })
  
      } else {
  
        return res.status(400).json({ msg: 'invalid or expired token' })
      }
  
    } catch (e) {
      console.log(e)
      res.status(400).send({ error: e.toString() })
    }
  
  };
  
  
  exports.resetForgotPassword = async (req, res, next) => {
    try {
      const { newPassword } = req.body;
      const user = await Encoder.findByPk(req.user.id);
      if (!user) return res.status(404).json({ msg: "faild"});
      bcrypt.hash(newPassword, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({ error: err.toString() })
        } else {
          user.password = hash;
          user.save().then((user) => {
            return res.status(200).json({ msg: "Password is changed successfully" });
          });
  
        }
      })
    } catch (e) {
      res.status(400).json({ error: e.toString() })
    }
  
  };
  
 