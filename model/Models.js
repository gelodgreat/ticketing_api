'use strict';

const Models = {
    
    Users: require('./Users'),
    Technicians: require('./Technicians'),
    Tickets: require('./Tickets'),
};

for (var model in Models) {
    Models[model]
}


module.exports = Models;