// Create a transporter object using SMTP transport
const nodemailer = require("nodemailer");

const sendMailService = (mailContent) => {
  const mailTemplate = {

    newdoctor: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
    <h2 style="color: #333333;">Welcome to Our Platform</h2>
    <p style="color: #555555;">Dear Dr.${mailContent.name},</p>
    <p style="color: #555555;">Welcome to our platform! We are excited to have you on board as a new doctor.</p>
    <p style="color: #555555;">Below are your login credentials:</p>
    <ul style="color: #555555;">
        <li><strong>Username:</strong> ${mailContent.email}</li>
        <li><strong>Password:</strong> ${mailContent.password}</li>
    </ul>
    <p style="color: #555555;">Please use these credentials to log in to your account.</p>
    <p style="color: #555555;">To activate your account, please click the button below:</p>
    <p><a href="" style="background-color: #007bff; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px; display: inline-block;">Activate Account</a></p>
    <p style="color: #555555;">If you have any questions or need assistance, feel free to contact us.</p>
    <p style="color: #555555;">Best regards,<br>Manthan</p></div>`,

    newuser: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
    <h2 style="color: #333333;">Verify Your Account</h2>
    <p style="color: #555555;">Dear ${mailContent.name},</p>
    <p style="color: #555555;">Thank you for signing up with our service. To complete your registration and verify your account, please click the link below:</p>
    <p><a href="http://localhost:3000/auth/verifyuser/${mailContent.token}" style="background-color: #007bff; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px; display: inline-block;">Verify My Account</a></p>
    <p style="color: #555555;">If you did not sign up for an account, please disregard this email.</p>
    <p style="color: #555555;">Best regards,<br>Manthan</p></div>`,

    forgotpassword:`<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
    <h2 style="color: #333333;">Reset Your Password</h2>
    <p style="color: #555555;">Dear ${mailContent.name} ,</p>
    <p style="color: #555555;">You have requested to reset your password. To proceed with resetting your password, please click the link below:</p>
    <p><a href="http://localhost:3000/auth/newpassword/${mailContent.token}" style="background-color: #007bff; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px; display: inline-block;">Reset Password</a></p>
    <p style="color: #555555;">If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>
    <p style="color: #555555;">Best regards,<br>Manthan</p>
    </div>`
  };


  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_SECRET,
      pass: process.env.MAIL_PASS,
    },
  });

  let mailOptions = {
    from: "manthanpanchal008@gmail.com",
    to: mailContent.email,
    subject: mailContent.subject,
    html: mailTemplate[mailContent.type],
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error occurred:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });

  return true;
};

module.exports = sendMailService;
