const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
require("./db_connection/dbconnect")
const authRoutes = require("./routes/authRoutes")
const adminRoutes = require("./routes/adminRoutes")

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use("/auth",authRoutes);
app.use('/admin',adminRoutes)
app.listen(PORT,() => console.log(`App is running on port:${PORT}`));
