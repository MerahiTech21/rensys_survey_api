const nodemailer = require("nodemailer");


const sendEmail = async (email, subject, text) => {
    // try {
        // let testAccount = await nodemailer.createTestAccount();
        const transporter = nodemailer.createTransport({
            // host: process.env.HOST,
            service: process.env.USER,
            port: 587,
            secure: false,
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            text: text,
        },(err,data)=>{

            if(err){
                console.log("Faild to send email😉", err);  
                throw err; 
            }else{
                console.log("email😉 sent sucessfully"); 
            }
        });

    // } catch (error) {
    //     console.log(error, "email not sent");
    // }
};

module.exports = sendEmail;