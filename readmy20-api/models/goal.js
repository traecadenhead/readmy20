'use strict';

const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    userID: String,
    year: Number,
    number: Number
});

const model = mongoose.model('Goal', goalSchema);

module.exports = model;