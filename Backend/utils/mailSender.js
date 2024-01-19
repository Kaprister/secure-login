const nodemailer = require('nodemailer');


const mailSender = async(email, title, body) => {
    try{
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth:{
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        })

        let info = await transporter.sendMail({
            from : 'Enhance Security Alerts',
            to: `${email}`,
            subject: `${title}`,
            html: `
            <h1>Dear User</h1>
            <h3>${body}<h4>
            `,
        })

        console.log(info);
        return info;

    }catch(error){
        console.log("error while sending mail : ", error.message);
        // console.log(error);
    }
}

module.exports = mailSender;