const axios = require('axios');

const sendSMS = async (message) => {
  try{
     await axios.post('https://hahu.io/api/send/sms',{},{
      params:{
    secret: process.env.HAHU_API_KEY, mode: "devices", phone: "+251975752668", device: process.env.DEVICE_KEY, message, sim:1, priority:1
  }
    } ); 
  console.log("😒😒😒😒 working good hahu sms");
 
  }catch(e){
    console.log("😒😒😒😒 faild hahu sms", e);
   throw e;
  }
}

module.exports = sendSMS
