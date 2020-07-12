'use strict';

const mongoose = require('../common/database')
const moment = require('moment');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectID;

const TicketsSchema = new Schema({
    requestorName: {
        type: String
    },
    ticketNumber: {
        type: String
    },
    message: {
        type: String
    },
    solution: {
        type: String
    },
    status: {
        type: String
    },
    technician: {
        type: ObjectId,
        ref: 'technician',
    },
    verified: {
        type: String
    },
    verifiedBy: {
        type: ObjectId,
        ref: 'users',
    },
    verifiedAt: {
        type: String
    },
    fixedAt: {
        type: String
    },
    createdBy: {
        type: ObjectId,
        ref: 'users',
    },
}, {
    collection: 'tickets',
    strict: false,
    timestamps: true,
})

module.exports = mongoose.model('tickets', TicketsSchema);