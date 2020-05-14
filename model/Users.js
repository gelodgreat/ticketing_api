'use strict';

const mongoose = require('../common/database')
const moment = require('moment');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectID;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        validate: value => {
            if (value.length < 4) {
                throw new Error('Password should be atleast 6 characters!')
            }
        }
    },
    userType: {
        type: String,
        required: true,
        enum: ["Admin", "Super Admin"]
    },
    tokens: {
        type: String,
    },
}, {
    collection: 'users',
    strict: false,
    timestamps: true,
})

UserSchema.pre('save', async function (next) {
    try {
        const users = this;
        users.validate();
        if (users.isModified('password')) {
            users.password = await bcrypt.hash(users.password, 10);
        }
        next();
    } catch (error) {
        return error;
    }
})

UserSchema.method('generateAuthToken', async function () {
    // Generate an auth token for the users
    try {
        const users = this;
        const token = jwt.sign({ _id: users._id }, 'WJ>w5P"PuF5=a:T$', { expiresIn: "1d" });
        users.tokens = token
        await users.save();
        return { token, };
    } catch (error) {
        return error;
    }
})

UserSchema.statics.findByCredentials = async function (username, password) {
    // Search for a users by email and password.
    try {
        const users = await Users.findOne({ username });
        if (!users) {
            return { error: 'Invalid login credentials' }
        }
        const isPasswordMatch = await bcrypt.compare(password, users.password);
        if (!isPasswordMatch) {
            return { error: 'Invalid login credentials' }
        }
        return users;
    } catch (error) {
        return error;
    }
}
const Users = mongoose.model('users', UserSchema);
Users.init().then(async () => {
    try {
        await Users.insertMany([{
            "username": "admin",
            "password": await bcrypt.hash("admin", 10),
            "name": "Admin",
            "userType": "Super Admin",
        }]
        )
    } catch (error) { }
})
module.exports = Users;