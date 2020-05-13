'use strict';

const mongoose = require('../common/database')
const moment = require('moment');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectID;

const TicketsSchema = new Schema({
    message: {
        type: String
    },
    solution: {
        type: String
    },
    status: {
        type: String
    },
    name: {
        type: String
    }

}, {
    collection: 'tickets',
    strict: false,
    timestamps: true,
})

module.exports = mongoose.model('tickets', TicketsSchema);