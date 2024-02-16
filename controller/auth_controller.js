const express = require("express");
const user = require("../model/user_schema");
const bcrypt = require("bcrypt");
const verifytoken = require("../utils/verifytoken");
const jwt = require("jsonwebtoken");
const sendMailService = require("../services/mail");

const signup = async (req, res) => {
  try {
    const { name, age, email, password, gender } = req.body;

    // check if user already exist
    const user_exist = await user.findOne({ email });
    if (user_exist) {
      return res
        .status(400)
        .json({ success: false, message: "User already exist" });
    }

    //add new user
    const hash_password = await bcrypt.hash(password, 6);
    const newUser = await user.create({
      name,
      age,
      email,
      password: hash_password,
      gender,
    });
    console.log(newUser._id);

    //genrate a token
    const token = jwt.sign({ id: newUser._id }, process.env.SECRET);
    console.log(token);

    // Setup email data
    let mailOptions = {
      from: "manthanpanchal008@gmail.com",
      to: email,
      subject: "Verify your account",
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
      <h2 style="color: #333333;">Verify Your Account</h2>
      <p style="color: #555555;">Dear ${name},</p>
      <p style="color: #555555;">Thank you for signing up with our service. To complete your registration and verify your account, please click the link below:</p>
      <p><a href="http://localhost:3000/auth/verifyuser/${token}" style="background-color: #007bff; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px; display: inline-block;">Verify My Account</a></p>
      <p style="color: #555555;">If you did not sign up for an account, please disregard this email.</p>
      <p style="color: #555555;">Best regards,<br>Manthan</p>
      </div>`,
    };

    // Send email
    const result  = await sendMailService(mailOptions);
    console.log(result);

    res.status(200).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error });
  }
};

const verifyuser = async (req, res) => {
  const token = req.params.token;
  console.log(token);
  try {
    const decodedToken = await verifytoken(token);
    await user.findByIdAndUpdate(
      { _id: decodedToken.id },
      { active: true },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "User verified successfully",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: "Link is Expried" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    // check if user exists
    const user_exist = await user.findOne({ email });
    console.log(user_exist);

    // check if user does not exist
    if (!user_exist) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exist" });
    }

    // check if password is correct
    const verified_password = await bcrypt.compare(
      password,
      user_exist.password
    );
    if (!verified_password) {
      return res
        .status(400)
        .json({ success: false, message: "Password does not match" });
    }

    // generate a token
    const loginToken = jwt.sign({ id: user_exist._id }, process.env.SECRET, {
      expiresIn: "1h",
    });
    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token: loginToken,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    // check if user exists
    const user_exist = await user.findOne({ email });
    if (!user_exist) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exist" });
    }
    // generate a token
    const forgotPasswordToken = jwt.sign(
      { id: user_exist._id },
      process.env.SECRET
    );

    // Setup email data
    const mailOptions = {
      from: "manthanpanchal008@gmail.com",
      to: email,
      subject: "Reset your password",
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
      <h2 style="color: #333333;">Reset Your Password</h2>
      <p style="color: #555555;">Dear ${user_exist.name} ,</p>
      <p style="color: #555555;">You have requested to reset your password. To proceed with resetting your password, please click the link below:</p>
      <p><a href="http://localhost:3000/auth/newpassword/${forgotPasswordToken}" style="background-color: #007bff; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px; display: inline-block;">Reset Password</a></p>
      <p style="color: #555555;">If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>
      <p style="color: #555555;">Best regards,<br>Manthan</p>
      </div>`,
    };

    const result  = await sendMailService(mailOptions);
    console.log(result);

    res.status(200).json({
      success: true,
      message: "Password reset link sent successfully",
      token: forgotPasswordToken,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const newpassword = async (req, res) => {
  const token = req.params.token;
  const password = req.body.password;
  const hash_password = await bcrypt.hash(password, 6);

  try {
    const decodedToken = await verifytoken(token);

    const userdata = await user.findByIdAndUpdate(decodedToken.id,
      { password:hash_password },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Password reset successfully",
      userdata
    });
  } catch (error) {
    res.status(400).json({ success: false, message: "Link is Expried" });
  }
}

module.exports = { signup, login, verifyuser, forgotPassword,newpassword };
