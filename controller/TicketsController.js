'use strict';
const Models = require('../model/Models')
const Technicians = Models['Technicians'];
const Tickets = Models['Tickets']
const ObjectId = require('mongodb').ObjectID;


class TicketsController {
    constructor() { }

    async getTickets(req, res) {
        try {
            const query = req.query;
            const tickets = req.params.id ? await Tickets.find(req.params.id) :
                await Tickets.find(query)
            res.send(tickets).status(200);
        } catch (error) {
            res.send({ message: error }).status(400);
        }
    }


    async addTicket(req, res) {
        try {
            const body = req.body;
            const data = {
                message: body['message'],
                solution: body['solution'],
            }

            const ticket = new Tickets(data);
            const ticketData = await ticket.save();
            const technicianData = await Technicians.findOneAndUpdate({ _id: new ObjectId(body['technicianId']) }, { $push: { tickets: ticketData } }, { new: true });

            res.send({ message: 'Success Saving Data', technicianData }).status(200);
        } catch (error) {
            console.log(error);
            res.send({ message: error }).status(400)
        }
    }

    async updateTicket(req, res) {
        try {
            var id = req.params.id;
            const body = req.body;
            const data = {
                message: body['message'],
                solution: body['solution'],
            }

            const ticketData = await Tickets.findOneAndUpdate({ _id: new ObjectId(id) }, data)
            res.send({ message: 'Success Updating Data', ticketData }).status(200);
        } catch (error) {
            res.send({ message: error }).status(400)
        }
    }

    async deleteTicket(req, res) {
        try {
            const id = req.params.id;
            const ticketData = await Tickets.deleteOne({ _id: new ObjectId(id) });
            res.send({ message: 'Success Deleting Data', ticketData }).status(200)
        } catch (error) {
            res.send({ message: error }).status(400)
        }
    }
}
module.exports = TicketsController