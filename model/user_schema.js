const express = require("express");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "others"],
  },
  role:{
    type: String,
    enum: ["ADMIN", "PATIENT", "DOCTOR"],
    required: true,
    default: "PATIENT",
  },
  active: {
    type: Boolean,
    default: false,
  },
  department:{
    type:String,
    required:false
  }
});
module.exports = mongoose.model("userslist", userSchema);
