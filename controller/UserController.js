'use strict';
const Models = require('../model/Models')
const Technicians = Models['Technicians'];
const Tickets = Models['Tickets']
const Users = Models['Users']
const ObjectId = require('mongodb').ObjectID;
const jwt = require('jsonwebtoken')

class TicketsController {
    constructor() { }

    async getUsers(req, res) {
        try {
            const query = req.query;
            const tickets = req.params.id ? await Users.find(req.params.id) :
                await Users.find(query)
            res.send(tickets).status(200);
        } catch (error) {
            res.send({ message: error }).status(400);
        }
    }

    async login(req, res) {
        try {
            const body = req.body;
            const username = body['username']
            const password = body['password']

            const user = await User.findByCredentials(username, password);
            if (user.error) {
                return res.status(401).send({ message: 'Invalid Authentication Credentials' });
            }
            const token = await user.generateAuthToken();
            const user_access = {
                token: token.token,
                refreshToken: token.refreshToken,
            }
            res.send({ user, user_access }).status(200);
        } catch (error) {
            res.status(400).send({ message: error })
        }
    }

    async addUser(req, res) {
        try {
            const body = req.body;
            const data = {
                name: body['name'],
                username: body['username'],
                password: body['password'],
                userType: body['userType'],
            }
            const users = new Users(data);
            const userData = await users.save();
            res.send({ message: 'Success Saving Data', userData }).status(200);
        } catch (error) {
            console.log(error);
            res.send({ message: error }).status(400)
        }
    }

    async updateUser(req, res) {
        try {
            var id = req.params.id;
            const body = req.body;
            const data = {
                name: body['name'],
                username: body['username'],
                password: body['password'],
                userType: body['userType'],
            }

            const userData = await Users.findOneAndUpdate({ _id: new ObjectId(id) }, data)
            res.send({ message: 'Success Updating Data', userData }).status(200);
        } catch (error) {
            res.send({ message: error }).status(400)
        }
    }

    async deleteUser(req, res) {
        try {
            const id = req.params.id;
            const userData = await Users.deleteOne({ _id: new ObjectId(id) });
            res.send({ message: 'Success Deleting Data', userData }).status(200)
        } catch (error) {
            res.send({ message: error }).status(400)
        }
    }


    async validateToken(req, res) {
        try {
            if (exemptedPath.includes(req.path)) {
                next();
            } else {
                const token = req.header('Authorization').replace('Bearer ', '');
                const data = jwt.verify(token, process.env.JWT_KEY);
                const user = await User.findOne({ _id: data._id, 'tokens.token': token });
                if (!user) {
                    throw new Error()
                }
                req.user = user;
                req.token = token;
                res.send({ user, message: "User Validated", validated: true }).status(200)
            }

        } catch (error) {
            console.log(error)
            if (error.name === "TokenExpiredError") {
                await removeToken(req)
                res.status(401).send({ message: 'Access Expired' });
            } else {
                res.status(401).send({ message: 'Unuthorized Access' })
            }
        }

        async function removeToken(req) {
            try {
                const expiredToken = req.header('Authorization').replace('Bearer ', '');
                const user = await User.findOne({ 'tokens.token': expiredToken });
                user.tokens = user.tokens.filter((token) => {
                    return token.token != expiredToken
                });
                await user.save();
            } catch (error) {
                console.log(error);
            }
        }

    }

}
module.exports = TicketsController