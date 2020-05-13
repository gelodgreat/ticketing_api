'use strict';

const Models = {
    Technicians: require('./Technicians'),
    Tickets: require('./Tickets'),
    Users: require('./Users'),
};

for (var model in Models) {
    Models[model]
}


module.exports = Models;