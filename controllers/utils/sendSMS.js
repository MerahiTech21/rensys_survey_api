// const e = require('express');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const sendSMS=(phone,message)=>{
    client.messages
  .create({
     body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
     from:  process.env.PHONE_NO,
     to: '+251975752668'
   })
  .then(message => console.log(message.sid, '😉')).catch((e)=>{
    
    console.log(e,'🙌')
 throw e;
}
   
    );
}

module.exports = sendSMS
