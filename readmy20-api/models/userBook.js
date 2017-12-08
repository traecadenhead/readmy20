'use strict';

const mongoose = require('mongoose');

const userBookSchema = new mongoose.Schema({
    bookID: String,
    userID: String,
    status: String,
    book: {
        title: String,
        author: String,
        description: String,
        rating: String,
        imageUrl: String
    }
});

const model = mongoose.model('UserBook', userBookSchema);

module.exports = model;