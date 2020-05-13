'use strict';

const express = require('express');
const router = express.Router();
const TicketsController = require('../controller/TicketsController');
const tickets = new TicketsController();

router.route('/tickets')
    .get(tickets.getTickets)
    .post(tickets.addTicket)

router.route('/tickets/:id')
    .get(tickets.getTickets)
    .put(tickets.updateTicket)
    .delete(tickets.deleteTicket)

module.exports = router;