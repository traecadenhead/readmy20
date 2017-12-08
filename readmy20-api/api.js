'use strict';

const express = require('express');
const parser = require('body-parser');

const app = express();

require('./database');

app.use(parser.json());

const db = require('./db');

app.post('/establishUser', function(req, res){
    db.getOrCreateUser(req.body).then(function(user){
        db.getGoalOrDefault(user.userID).then(function(goal){
            db.getBooks(user.userID).then(function(books){
                return res.json({user, goal, books});
            });            
        });
    }, function(err){
        return res.status(500).json({message: err.message});
    });
});

app.post('/saveBook', function(req, res){
    db.saveBook(req.body).then(function(book){
        return res.json(book);
    }, function(err){
        return res.status(500).json({message: err.message});
    });
});

app.post('/removeBook', function(req, res){
    db.removeBook(req.body.userID, req.body.bookID).then(function(result){
        return res.json(result);
    }, function(err){
        return res.status(500).json({message: err.message});
    });
});

app.post('/saveGoal', function(req, res){
    db.saveGoal(req.body).then(function(goal){
        return res.json(goal);
    }, function(err){
        return res.status(500).json({message: err.message});
    });
});

app.listen(3000, function(){
	console.log("server running");
});