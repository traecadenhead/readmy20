'use strict';

const express = require('express');
const parser = require('body-parser');

const app = express();

require('./database');

app.use(parser.json());

const db = require('./db');

const authRequest = function(req, res, next){
    if(req.url == '/loginUser' || req.url == '/createUser'){
        next();
    }
    db.verifyAuth(req.header("Authorization")).then(function(user){
        res.locals.user = user;
        next();
    }, function(err){
        return res.status(401).json({message: err.message});
    });	
};

app.use(authRequest);

app.post('/createuser', function(req, res){
    db.createUser(req.body).then(function(data){
        return res.json(data);
    }, function(err){
        return res.status(500).json({message: err.message});
    });
});

app.post('/loginUser', function(req, res){
    db.loginUser(req.body).then(function(data){
		return res.json(data);
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

app.get('/getUser/:id', function(req, res){
    db.getUser(req.params.id).then(function(result){
        return res.json(result);
    }, function(err){
        return res.status(500).json({message: err.message});
    });
});

app.get('/getAuthenticatedUser', function(req, res){
    const user = req.res.locals.user;
    db.getUser(user.userID).then(function(result){
        return res.json(result);
    }, function(err){
        return res.status(500).json({message: err.message});
    });
});

app.listen(3000, function(){
	console.log("server running");
});