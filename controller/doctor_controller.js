const user = require("../model/user_schema");
const jwt = require("jsonwebtoken");
const sendMailService = require("../services/mail");
const bcrypt = require("bcrypt");

const createDoctor = async (req, res) => {
  const { name, age, email, gender, department } = req.body;
  const password = Math.random().toString(36).slice(-8);
  try {
    //check if doctor exists
    const doctor_exist = await user.findOne({ email });
    if (doctor_exist) {
      return res
        .status(400)
        .send({ success: false, message: "Doctor already exists" });
    }

    //create a new doctor
    const hasedpassword = await bcrypt.hash(password, 10);
    // console.log("password ===>",hasedpassword)
    const newDoctor = await user.create({
      name,
      age,
      email,
      gender,
      password: hasedpassword,
      role: "DOCTOR",
      department,
    });
    //genrate a token
    const token = jwt.sign({ id: newDoctor._id }, process.env.SECRET);
    console.log(token);

    // Send email
    const mailContent= { email,name,password, type : "newdoctor" ,subject : "Activate your account",};
    // console.log(mailContent)
    const result = await sendMailService(mailContent);
    console.log(result);

    res.status(200).json({
      success: true,
      message: "doctor created successfully",
      user: newDoctor,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error });
  }
};

module.exports = { createDoctor };
