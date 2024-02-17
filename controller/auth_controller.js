/* The code is defining several functions related to user authentication and management. Here is a
breakdown of what each function does: */

const express = require("express");
const user = require("../model/user_schema");
const bcrypt = require("bcrypt");
const verifytoken = require("../utils/verifytoken");
const jwt = require("jsonwebtoken");
const sendMailService = require("../services/mail");

const signup = async (req, res) => {
  try {
    const { name, age, email, password, gender,role } = req.body;

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
      role,
    });
    console.log(newUser._id);

    //genrate a token
    const token = jwt.sign({ id: newUser._id }, process.env.SECRET);
    console.log(token);

    // Send email
    const mailContent= { email,name,token, type : "newuser" ,subject : "Verify your account",};
    // console.log(mailContent)
    const result = await sendMailService(mailContent);
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
  //teking the token
  const token = req.params.token;

  try {
    //check if the token is valid
    const decodedToken = await verifytoken(token);
    
    //update the active status of the user
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

    //taking the email and password from the  body
    const { email, password } = req.body;
   
    // check if user exists
    const user_exist = await user.findOne({ email });

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
      expiresIn: "1h", // expires in 1hour
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

    // check if user does not exist
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

    // Send email
    const mailContent= { email,name:user_exist.name,token:forgotPasswordToken, type : "forgotpassword" ,subject : "Reset your password",};
    // console.log(mailContent)
    const result = await sendMailService(mailContent);
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

  //teking the token from header
  const token = req.params.token;

  //taking the password from the body
  const password = req.body.password;

  //hash the password
  const hash_password = await bcrypt.hash(password, 6);

  try {
    //check if the token is valid
    const decodedToken = await verifytoken(token);

    //update the new password
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

const getAllUsers = async (req, res) => {
  try {
    const users = await user.find();
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

module.exports = { signup, login, verifyuser, forgotPassword,newpassword,getAllUsers};
