'use strict';

const mongoose = require('mongoose');

const userBookSchema = new mongoose.Schema({
    bookID: String,
    userID: String,
    status: String,
    book: {
		isbn: String,
        title: String,
        author: String,
        publisher: String,
        year: Number,
        pages: Number,
        rating: Number,
        imageUrl: String,
		summary: String
    }
});

const model = mongoose.model('UserBook', userBookSchema);

module.exports = model;