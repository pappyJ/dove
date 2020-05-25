const nodemailer = require('nodemailer');


//end of modules requiring 


const emailSender = async options =>

{
    const transporter = nodemailer.createTransport({


        host: process.env.EMAIL_HOST,

        // service: 'Gmail',

        port: process.env.EMAIL_PORT,

        // secure: true,

        auth:
        
        {
            user: process.env.EMAIL_USERNAME,

            pass: process.env.EMAIL_PASSWORD

            //for Gmail

            // user: 'peterjoshua828@gmail.com',

            // pass: 'sisterangela'
        }


    })

    const mailOPtions = 

    {
        from: 'JOSHPEE TECH SOLUTIONS <peterjoshua828@gmail.com',

        to: options.email,

        subject: options.subject,

        text: options.message,

        // html
    }

    await transporter.sendMail(mailOPtions);
}

module.exports = emailSender;