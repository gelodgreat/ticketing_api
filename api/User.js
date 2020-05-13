'use strict';

const express = require('express');
const router = express.Router();
const UserController = require('../controller/UserController');
const account = new UserController();

router.route('/account')
    .get(account.getUsers)
    .post(account.addUser)

router.route('/account/:id')
    .get(account.getUsers)
    .put(account.updateUser)
    .delete(account.deleteUser)

router.post('/login', account.login)

module.exports = router;