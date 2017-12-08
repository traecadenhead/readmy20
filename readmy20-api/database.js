'use strict';

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/readmy20', function(err){
    if(err){
        console.log("failed connecting to MongoDB")
    }else{
        console.log("successfully connected to MongoDB");
    }
});