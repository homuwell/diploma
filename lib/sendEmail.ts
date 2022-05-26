const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper

    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER, // generated ethereal user
            pass: process.env.SMTP_PASSWORD, // generated ethereal password
        },
    });

     const sendActivationLink = async  (to: string, link : string) => {
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: to,
            subject: 'Активация аккаунта',
            text: '',
            html: `<div>
    
                        <h1>Для активации аккаунта перейдите по ссылке</h1>
                        <a href="${process.env.ACTIVATE_URL + link}">${process.env.ACTIVATE_URL + link}</a>
                  </div>`
        });
    }

export default sendActivationLink