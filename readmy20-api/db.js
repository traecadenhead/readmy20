const User = require('./models/user');
const Goal = require('./models/goal');
const UserBook = require('./models/userbook');

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

const getBooks = (userID) => {
    return new Promise(function(resolve, reject){
        UserBook.find({userID}, function(err, books){
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