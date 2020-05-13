'use strict';

const jwt = require('jsonwebtoken')
const Models = require('../model/Models');
const User = Models['Users'];
const exemptedPath = [
    '/users/auth/login',
    '/users/refreshToken',
    '/test',
]

const auth = async (req, res, next) => {

    try {
        if (exemptedPath.includes(req.path)) {
            next();
        } else {
            const token = req.header('Authorization').replace('Bearer ', '');
            const data = jwt.verify(token, process.env.JWT_KEY);

            const user = await User.findOne({ _id: data._id, 'token': token });
            if (!user) {
                throw new Error()
            }
            req.user = user;
            req.token = token;
            next();
            // res.send({ user, message: "User Validated", validated: true }).status(200)
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
            const user = await User.findOne({ 'token': expiredToken });
            user.tokens = ""
            await user.save();
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = auth