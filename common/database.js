'use strict';

const mongoose = require('mongoose');
// const DatabaseConnection = "mongodb://admin:admin@localhost:27017/ticketing?authSource=admin?retryWrites=true&w=majority"
const DatabaseConnection = "mongodb+srv://admin:admin@clusterx-fcfrz.gcp.mongodb.net/ticketing"
try {
    mongoose.connect(DatabaseConnection, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        poolSize: 10,
        autoIndex: true //in production this must be false
    }).catch(error => {
        console.log(error)
    });
    mongoose.Promise = global.Promise;

    mongoose.connection.on('connected', () => {
        console.log(`Mongoose connected to ${DatabaseConnection}`)
    })

    mongoose.connection.on('error', (err) => {
        console.log('Mongoose connection error: ' + err);
    })

    mongoose.connection.on('disconnected', function () {
        console.log('Mongoose connection disconnected');
    });

    process.on('SIGINT', function () {
        mongoose.connection.close(function () {
            console.log('Mongoose  connection disconnected through app termination');
            process.exit(0);
        });
    });

} catch (error) {
    console.log(error)
}

module.exports = mongoose;