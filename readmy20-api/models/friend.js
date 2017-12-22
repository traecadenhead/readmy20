'use strict';

const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
    userID: String,
    userName: String,
    friendID: String,
    friendName: String,
    status: String
});

const model = mongoose.model('Friend', friendSchema);

module.exports = model;