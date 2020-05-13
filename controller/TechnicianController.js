'use strict';
const Models = require('../model/Models')
const Technicians = Models['Technicians'];
const Tickets = Models['Tickets']
const ObjectId = require('mongodb').ObjectID;


class TechnicianController {
    constructor() { }

    async getTechnicians(req, res) {
        try {
            const query = req.query;
            const technicians = req.params.id ? await Technicians.find(req.params.id).populate('tickets') :
                await Technicians.find(query).populate('tickets');
            res.send(technicians).status(200);
        } catch (error) {
            res.send({ message: error }).status(400);
        }
    }


    async addTechnician(req, res) {
        try {
            const body = req.body;
            const data = {
                name: body['name'],
                message: body['message'],
            }
            const technician = new Technicians(data);
            const technicianData = await technician.save();
            res.send({ message: 'Success Saving Data', technicianData }).status(200);
        } catch (error) {
            console.log(error);
            res.send({ message: error }).status(400)
        }
    }

    async updateTechnician(req, res) {
        try {
            var id = req.params.id;
            const body = req.body;
            const data = {
                name: body['name'],
                message: body['message'],
            }

            const technicianData = await Technician.findOneAndUpdate({ _id: new ObjectId(id) }, data)
            res.send({ message: 'Success Updating Data', technicianData }).status(200);
        } catch (error) {
            res.send({ message: error }).status(400)
        }
    }

    async deleteTechnician(req, res) {
        try {
            const id = req.params.id;
            const technicianData = await Technician.deleteOne({ _id: new ObjectId(id) });
            res.send({ message: 'Success Deleting Data', technicianData }).status(200)
        } catch (error) {
            res.send({ message: error }).status(400)
        }
    }
}
module.exports = TechnicianController