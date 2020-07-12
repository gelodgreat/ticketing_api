'use strict';
const Models = require('../model/Models')
const Technicians = Models['Technicians'];
const Tickets = Models['Tickets']
const ObjectId = require('mongodb').ObjectID;
const moment = require('moment');

class TicketsController {
    constructor() {
        this.genetrateTicket = this.genetrateTicket.bind(this);
        this.addTicket = this.addTicket.bind(this)
    }

    async getTickets(req, res) {
        try {
            const query = req.query;
            const tickets = req.params.id ? await Tickets
                .findOne({ _id: new ObjectId(req.params.id) })
                .populate('technician')
                .populate('verifiedBy')
                .populate('createdBy')
                .sort({ createdAt: -1 })
                :
                await Tickets.find(query)
                    .populate('technician')
                    .populate('createdBy')
                    .populate('verifiedBy')
                    .sort({ createdAt: -1 });
            res.send(tickets).status(200);
        } catch (error) {
            console.log(error)
            res.send({ message: error }).status(400);
        }
    }

    async genetrateTicket() {
        const ticketNumber = `CEU${Math.floor((Math.random() * 1000000) + 1)}`
        const checkTicketNumber = await Tickets.findOne({ ticketNumber: ticketNumber })
        if (checkTicketNumber) {
            this.genetrateTicket()
        }
        return ticketNumber
    }

    async addTicket(req, res) {
        try {
            const body = req.body;
            const user = req.user;
            const data = {
                requestorName: body['requestorName'],
                message: body['message'],
                solution: "",
                status: "Pending",
                technician: body['technician'],
                verified: "unverified",
                createdBy: user._id,
                createdAt: moment().format('YYYY/MM/D hh:mm'),
                ticketNumber: await this.genetrateTicket()
            }
            const ticket = new Tickets(data);
            const ticketData = await ticket.save();
            const technicianData = await Technicians.findOneAndUpdate({ _id: new ObjectId(body['technician']) }, { $push: { tickets: ticketData } }, { new: true });

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
            const user = req.user;

            const data = {
                message: body['message'],
                solution: body['solution'],

                technician: body['technician'],
                verified: body['verified'],
                verifiedBy: body['verified'] === "verified" ? user._id : '',
                verifiedAt: body['verified'] === "verified" ? moment().format('YYYY/MM/D hh:mm') : '',
                fixedAt: body['solution'] ? moment().format('YYYY/MM/D hh:mm') : '',
            }

            if (body['verified'] === "verified" && !body['solution']) {
                data['status'] = "Ongoing"
            }
            if (body['verified'] === "verified" && body['solution']) {
                data['status'] = "Fixed"
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