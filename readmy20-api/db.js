const User = require('./models/user');
const Goal = require('./models/goal');
const UserBook = require('./models/userbook');
const Friend = require('./models/friend');
const Token = require('./models/token');
const jwt = require('jsonwebtoken');

const defaultGoal = 20;
const tokenKey = "2138723";

const createUser = (userToCreate) => {
    return new Promise(function(resolve, reject){  
		try{
            User.findOne({userID: userToCreate.userID}, function(err, userResult){
                if(err){
                    reject(Error(err.message));
                }
                if (userResult != null){                    
                    reject(Error("user already exists"));
                }
                else{
                    const user = new User(userToCreate);
                    user.save(function(err, result){
                        if(err){
                            reject(Error(err.message));
                        }else{
                            getGoalOrDefault(user.userID).then(function(goal){
                                getInvites(user.userID).then(function(invites){
                                    let i = 0;
                                    let friends = [];
                                    const books = [];
                                    const token = generateToken(user.userID);
                                    if(invites.length > 0){
                                        for(let friend of invites){
                                            // mark as accepted friend
                                            friend.friendName = user.name;
                                            friend.status = "Accepted";
                                            saveFriend(friend).then(function(){
                                                // make this person a friend of the user as well 
                                                var userFriend = {
                                                    userID: user.userID,
                                                    userName: user.name,
                                                    friendID: friend.userID,
                                                    friendName: friend.userName,
                                                    status: "Accepted"
                                                };
                                                saveFriend(userFriend).then(function(result){
                                                    friends.push(result);
                                                    i++;
                                                    if(i == invites.length){
                                                        resolve({user, goal, books, friends, token});
                                                    }
                                                }, function(err){
                                                    reject(err);
                                                });
                                            }, function(err){
                                                reject(err);
                                            });                                
                                        }
                                    }
                                    else{
                                        resolve({user, goal, books, friends, token});
                                    }
                                }, function(err){
                                    reject(err);
                                });                    
                            }, function(err){
                                reject(err);
                            });
                            resolve(result);
                        }
                    });
                }
            });
		}
		catch(e){
			reject(e);
		}
    });
}
module.exports.createUser = createUser;

const loginUser = (userToLogin) => {
    return new Promise(function(resolve, reject){  
		try{
            User.findOne({userID: userToLogin.userID, password: userToLogin.password, loginType: userToLogin.loginType}, function(err, user){
                if(err){
                    reject(Error(err.message));
                }
                else{
                    if(user == null){
                        resolve(user);
                    }
                    getGoalOrDefault(user.userID).then(function(goal){
                        getBooks(user.userID).then(function(books){
                            getFriends(user.userID).then(function(friends){
                                const token = generateToken(user.userID);
                                resolve({user, goal, books, friends, token});
                            }, function(err){
                               reject(err);
                            });        
                        });             
                    }, function(err){
                        reject(err);
                    });
                }
            });
		}
		catch(e){
			reject(e);
		}
    });
}
module.exports.loginUser = loginUser;

const generateToken = (userID) => {
    return jwt.sign({userID}, tokenKey);
}

const verifyAuth = (auth) => {
    return new Promise(function(resolve, reject){
        if(auth != undefined && auth != null){
            const tokenStr = auth.replace("Bearer ", "");
            const decoded = jwt.verify(tokenStr, tokenKey);
            if(decoded.userID != null && decoded.userID != ''){
                User.findOne({userID: decoded.userID}, function(err, user){
                    if(err){
                        reject(Error(err.message));
                    }
                    if(user != null){
                        resolve(user);
                    }
                    else{
                        reject(Error("invalid userID"));
                    }
                });
            }
            else{
                reject(Error("invalid userID"));
            }
        }
        else{
            reject(Error("request not authenticated"));
        }
    });
}
module.exports.verifyAuth = verifyAuth;

const getUser = (userID) => {
    return new Promise(function(resolve, reject){  
        User.findOne({userID}, function(err, user){
            if(err){
                reject(Error(err.message));
            }
            if (user != null){
				getGoalOrDefault(userID).then(function(goal){
					if(goal != null){
						getBooks(userID).then(function(books){
                            getFriends(userID).then(function(friends){
                                resolve({user, goal, books, friends});
                            }, function(err){
                                reject(err);
                            });
						}, function(err){
                            reject(err);
                        });
					}
					else{
						resolve(null);
					}
				}, function(err){
                    reject(err);
                });
            }
            else{
                resolve(null);
            }
        });
    });
}
module.exports.getUser = getUser;

const getGoalOrDefault = (userID) => {
    return new Promise(function(resolve, reject){
        const year = new Date().getFullYear();
        Goal.findOne({userID, year}, function(err, goal){
            if(err){
                reject(Error(err.message));
            }
            if (goal != null){
                resolve(goal);
            }
            else{
                // create goal
                const goal = new Goal({
                    userID,
                    year,
                    number: defaultGoal
                });
                goal.save(function(err, result){
                    if(err){
                        reject(Error(err.message));
                    }else{
                        resolve(result);
                    }
                });
            }
        });
    });
}
module.exports.getGoalOrDefault = getGoalOrDefault;

const saveGoal = (goal) => {
    return new Promise(function(resolve, reject){
        const number = goal.number;
        const year = new Date().getFullYear();
        Goal.findOne({userID: goal.userID, year}, function(err, goalResult){
            if(err){
                reject(Error(err.message));
            }
            else{
                let userGoal = null;
                if (goalResult != null){
                    userGoal = goalResult;
                    userGoal.number = goal.number;
                }
                else{
                    userGoal = new Goal(goal);
                }
                userGoal.save(function(err, result){
                    if(err){
                        reject(Error(err.message));
                    }
                    else{
                        resolve(result);
                    }
                });
            }
        });
    });
}
module.exports.saveGoal = saveGoal;

const getBooks = (userID, year = null) => {
    return new Promise(function(resolve, reject){
        if(year == null){
            year = new Date().getFullYear();
        }
        UserBook.find({userID, year}, function(err, books){
            if(err){
                reject(Error(err.message));
            }
            else{
                resolve(books);
            }
        });
    });
}
module.exports.getBooks = getBooks;

const saveBook = (book) => {
    return new Promise(function(resolve, reject){
        UserBook.findOne({userID: book.userID, bookID: book.bookID}, function(err, bookResult){
            if(err){
                reject(Error(err.message));
            }
            else{
                let userBook = null;
                if(bookResult != null){
                    userBook = bookResult;
                    userBook.status = book.status;
                }
                else{
                    userBook = new UserBook(book);
                }
                // save year on book
                userBook.year = new Date().getFullYear();
                userBook.save(function(err, result){
                    if(err){
                        reject(Error(err.message));
                    }
                    else{
                        resolve(result);
                    }
                });
            }
        });
    });
}
module.exports.saveBook = saveBook;

const removeBook = (userID, bookID) => {
    return new Promise(function(resolve, reject){
        UserBook.findOneAndRemove({userID, bookID}, function(err, result){
            if(err){
                reject(Error(err.message));
            }
            else{
                if(result != null){
                    resolve(true);
                }
                else{
                    resolve(false);
                }
            }
        });
    });
}
module.exports.removeBook = removeBook;

const saveFriend = (friend) => {
    return new Promise(function(resolve, reject){
        Friend.findOne({userID: friend.userID, friendID: friend.friendID}, function(err, friendResult){
            if(err){
                reject(Error(err.message));
            }
            else{
                if(friendResult != null){
                    friendResult.friendName = friend.friendName;
                    friendResult.userName = friend.userName;
					if(friend.status != null && friend.status != ''){
						friendResult.status = friend.status;
					}
                    friendResult.save(function(err, result){
                        if(err){
                            reject(Error(err.message));
                        }
                        else{
                            resolve(result);
                        }
                    });
                }
                else{
                    // make sure this friend is in db
                    User.findOne({userID: friend.friendID}, function(err, userResult){
                        if(err){
                            reject(Error(err.message));
                        }
                        else{
                            if(userResult != null){
                                friend.status = "Accepted";
                            }
                            else{
                                friend.status = "Invited";
                            }
                            userFriend = new Friend(friend);
                            userFriend.save(function(err, saveResult){
                                if(err){
                                    reject(Error(err.message));
                                }
                                else{
                                    resolve(saveResult);
                                }
                            });
                        }
                    });                    
                }
                
            }
        });
    });
}
module.exports.saveFriend = saveFriend;

const removeFriend = (userID, friendID) => {
    return new Promise(function(resolve, reject){
        Friend.findOneAndRemove({userID, friendID}, function(err, result){
            if(err){
                reject(Error(err.message));
            }
            else{
                if(result != null){
                    resolve(true);
                }
                else{
                    resolve(false);
                }
            }
        });
    });
}
module.exports.removeFriend = removeFriend;

const getInvites = (friendID) => {
    return new Promise(function(resolve, reject){
        Friend.find({friendID, status: "Invited"}, function(err, invites){
            if(err){
                reject(Error(err.message));
            }
            else{
                resolve(invites);
            }
        });
    });
}
module.exports.getInvites = getInvites;

const getFriends = (userID) => {
    return new Promise(function(resolve, reject){
        Friend.find({userID, status: "Accepted"}, function(err, friends){
            if(err){
                reject(Error(err.message));
            }
            else{
                resolve(friends);
            }
        });
    });
}
module.exports.getFriends = getFriends;