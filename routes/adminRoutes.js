const express = require('express');
const { createDoctor } = require('../controller/doctor_controller');
const router = express.Router();

router.post('/createdoctor',createDoctor)

module.exports = router;