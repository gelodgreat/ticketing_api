'use strict';

const express = require('express');

const portNumber = process.env.PORT ? process.env.PORT : 80;
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const database = require('./common/database');
const Models = require('./model/Models');
const auth = require('./middleware/auth');

const TechnicianAPI = require('./api/Technician');
const TicketsAPI = require('./api/Tickets');
const UserAPI = require('./api/User');


app.use(cors());
app.use(logger('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({
    extended: false
}));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(auth);
app.use('/', TechnicianAPI);
app.use('/', TicketsAPI);
app.use('/', UserAPI);


app.listen(portNumber, () => {
    console.log(`Server Running @ ${portNumber}`);
})

app.use(function (req, res, next) {
    res.status(404).send('Not Found');
});

module.exports = app;