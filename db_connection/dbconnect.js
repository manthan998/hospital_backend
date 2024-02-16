const mongoose = require("mongoose");
const dotenv = require("dotenv")

dotenv.config();

const url = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@cluster0.uye67jl.mongodb.net/`;

mongoose.connect(url).then(()=> console.log("Database connected")).catch((error) => console.log(error));

