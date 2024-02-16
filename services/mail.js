// Create a transporter object using SMTP transport
const nodemailer = require("nodemailer");

const sendMailService = (mailOptions) => {
    console.log(process.env.MAIL_SECRET, process.env.MAIL_PASS,)
    const transporter =  nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MAIL_SECRET,
          pass: process.env.MAIL_PASS,
        },
      })
    
    // Send email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error occurred:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      })
    
      return true;
}

module.exports = sendMailService
