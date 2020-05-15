'use strict';

const express = require('express');
const router = express.Router();
const UserController = require('../controller/UserController');
const account = new UserController();

router.route('/users')
    .get(account.getUsers)
    .post(account.addUser)

router.route('/user/:id')
    .get(account.getUsers)
    .put(account.updateUser)
    .delete(account.deleteUser)

router.post('/login', account.login)
router.post('/logout', account.logout);
module.exports = router;