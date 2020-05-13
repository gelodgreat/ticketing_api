'use strict';

const express = require('express');
const router = express.Router();
const TechnicianController = require('../controller/TechnicianController');
const technician = new TechnicianController();

router.route('/technician')
    .get(technician.getTechnicians)
    .post(technician.addTechnician)

router.route('/technician/:id')
    .get(technician.getTechnicians)
    .put( technician.updateTechnician)
    .delete(technician.deleteTechnician)

module.exports = router;