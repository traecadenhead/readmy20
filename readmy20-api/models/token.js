'use strict';

const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    userID: String,
    accessToken: String,
    expiration: Date
});

const model = mongoose.model('Token', tokenSchema);

module.exports = model;