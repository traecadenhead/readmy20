'use strict';

const express = require('express');
const parser = require('body-parser');

const app = express();

require('./database');

app.use(parser.json());

const db = require('./db');

// deprecated
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

app.post('/loginUser', function(req, res){
    db.getOrCreateUser(req.body).then(function(user){
        db.getGoalOrDefault(user.userID).then(function(goal){
            db.getBooks(user.userID).then(function(books){
                if(req.body.name != undefined && req.body.name != null){
                    // create account
                    db.getInvites(user.userID).then(function(invites){
                        let i = 0;
                        let friends = [];
                        if(invites.length > 0){
                            for(let friend of invites){
                                // mark as accepted friend
                                friend.friendName = user.name;
                                friend.status = "Accepted";
                                db.saveFriend(friend).then(function(){
                                    // make this person a friend of the user as well 
                                    var userFriend = {
                                        userID: user.userID,
                                        userName: user.name,
                                        friendID: friend.userID,
                                        friendName: friend.userName,
                                        status: "Accepted"
                                    };
                                    db.saveFriend(userFriend).then(function(result){
                                        friends.push(result);
                                        i++;
                                        if(i == invites.length){
                                            return res.json({user, goal, books, friends});
                                        }
                                    }, function(err){
                                        return res.status(500).json({message: err.message});
                                    });
                                }, function(err){
                                    return res.status(500).json({message: err.message});
                                });                                
                            }
                        }
                        else{
                            return res.json({user, goal, books, friends});
                        }
                    }, function(err){
                        return res.status(500).json({message: err.message});
                    });
                }
                else{
                    // login
                    db.getFriends(user.userID).then(function(friends){
                        return res.json({user, goal, books, friends});
                    }, function(err){
                        return res.status(500).json({message: err.message});
                    });
                }
            }, function(err){
                return res.status(500).json({message: err.message});
            });                       
        }, function(err){
            return res.status(500).json({message: err.message});
        });
    }, function(err){
        return res.status(500).json({message: err.message});
    });
});

app.post('/saveBook', function(req, res){
	console.log(req.body);
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

app.post('/saveFriend', function(req, res){
    db.saveFriend(req.body).then(function(friend){
        return res.json(friend);
    }, function(err){
        return res.status(500).json({message: err.message});
    });
});

app.post('/removeFriend', function(req, res){
    db.removeFriend(req.body.userID, req.body.friendID).then(function(result){
        return res.json(result);
    }, function(err){
        return res.status(500).json({message: err.message});
    });
});

app.listen(3000, function(){
	console.log("server running");
});