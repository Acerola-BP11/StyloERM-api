const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

async function sendMail(username, userEmail, tempUserId) {
    const info = await transporter.sendMail({
        from: process.env.MAIL_USERNAME,
        to: 'felipegrego23@outlook.com',
        subject: "Criação de Úsuario - Stylo PDV",
        html: `<div style="display: flex; align-items: center; justify-content: center; width: 100%;">
        <b>
          <div style="text-align: center;">
            <img src="cid:logo@nobackground" width="300" height="300" style="margin-right: 10px;"/>
            <h2 style="margin: 0;">Criação de Usuário Stylo PDV</h2>
          </div>
          <br>
          <br>
          <h4>Email: ${userEmail}</h4>
          <h4>Username: ${username}</h4>
          <br>
          <a><h4>https://styloapi.vercel.app/user/confirmRegistration/${tempUserId}<h4><a>
        </b>
      </div>`,
    attachments: [{
        filename: 'logo-no-background.png',
        path: './',
        cid: 'logo@nobackground'
    }]

    });

    console.log("Message sent: %s", info.messageId);

}

module.exports = sendMail