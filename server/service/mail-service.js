const nodemailer = require('nodemailer');

class MailService {
   constructor() {
      this.transporter = nodemailer.createTransport({
         host: process.env.SMTP_HOST,
         port: process.env.SMTP_PORT,
         secure: false,
         auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
         }
      })
   }

   async sendActivationMail(to, link) {
      // отправка письма
      await this.transporter.sendMail({
         from: process.env.SMTP_USER,
         to,
         subject: 'Активация аккаунта на' + process.env.API_URL,
         text: '',
         html: `
            <div>Для актвиации перейдите по ссылке</div>
            <a href="${link}">${link}</a>
         `
      });
   }
}

module.exports = new MailService();