const User = require('./models/user');
const Goal = require('./models/goal');
const UserBook = require('./models/userbook');
const Friend = require('./models/friend');

const defaultGoal = 20;

const getOrCreateUser = (user) => {
    return new Promise(function(resolve, reject){  
        User.findOne({userID: user.userID, loginType: user.loginType}, function(err, userResult){
            if(err){
                reject(Error(err.message));
            }
            if (userResult != null){
                resolve(userResult);
            }
            else{
                // create user
                const createUser = new User(user);
                createUser.save(function(err, result){
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
module.exports.getOrCreateUser = getOrCreateUser;

const loginUser = (user) => {
    return new Promise(function(resolve, reject){  
		try{
			if(user.name != undefined && user.name != null){
				console.log("creating account");
				// create account
				User.findOne({userID: user.userID, loginType: user.loginType}, function(err, userResult){
					if(err){
						reject(Error(err.message));
					}
					if (userResult != null){                    
						resolve(userResult);
					}
					else{
						// create user
						const createUser = new User(user);
						createUser.save(function(err, result){
							if(err){
								reject(Error(err.message));
							}else{
								resolve(result);
							}
						});
					}
				});
			}
			else{
				// login
				User.findOne({userID: user.userID, password: user.password, loginType: user.loginType}, function(err, userResult){
					if(err){
						reject(Error(err.message));
					}
					else{
						resolve(userResult);
					}
				});
			}
		}
		catch(e){
			reject(e);
		}
    });
}
module.exports.loginUser = loginUser;

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
							resolve({user, goal, books});
						});
					}
					else{
						resolve(null);
					}
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