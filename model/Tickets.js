'use strict';

const mongoose = require('../common/database')
const moment = require('moment');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectID;

const TicketsSchema = new Schema({
    requestorName: {
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
    createdBy: {
        type: ObjectId,
        ref: 'users',
    }
}, {
    collection: 'tickets',
    strict: false,
    timestamps: true,
})

module.exports = mongoose.model('tickets', TicketsSchema);