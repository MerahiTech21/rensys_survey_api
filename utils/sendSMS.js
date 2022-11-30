// // const e = require('express');

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = require('twilio')(accountSid, authToken);

// const sendSMS=(phone,message)=>{
//     client.messages
//   .create({
//      body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
//      from:  process.env.PHONE_NO,
//      to: '+251975752668'
//    })
//   .then(message => console.log(message.sid, '😉')).catch((e)=>{
    
//     console.log(e,'🙌')
//  throw e;
// }
   
//     );
// }

const  messagebird = require('messagebird')(process.env.YOUR_API_KEY);

const sendSMS =()=>{
messagebird.messages.create({
  originator : '+251975752668',
  recipients : '+',  
  body : 'Hello World, I am a text message and I was hatched by Javascript code!'
},function (err, response) {
  if (err) {
     console.log("ERROR:");  
     console.log(err);
 } else {
     console.log("SUCCESS:");
     console.log(response);  
 }   
});
}

module.exports = sendSMS
