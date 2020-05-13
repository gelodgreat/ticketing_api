'use strict';

const mongoose = require('../common/database')
const moment = require('moment');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectID;

const TechnicianSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    tickets: [{
        type: ObjectId,
        ref: 'tickets',
    }],
}, {
    collection: 'technician',
    strict: false,
    timestamps: true,
})

module.exports = mongoose.model('technician', TechnicianSchema);