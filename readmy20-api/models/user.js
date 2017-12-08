'use strict';

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userID: String,
    loginType: String,
    name: String
});

const model = mongoose.model('User', userSchema);

module.exports = model;