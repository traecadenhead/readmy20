import { params } from '../config/params';
import { AsyncStorage } from 'react-native';

export default class api{

    static loginUser = (user) => {
        return new Promise(function(resolve, reject){
            user.userID = api.cleanPhone(user.userID);
            api.makeAPIRequest('loginUser', "POST", user).then(function(data){
                resolve(data);
            }, function(err){
                reject(err);
            });
        }); 
    };

    static createUser = (user) => {
        return new Promise(function(resolve, reject){
            user.userID = api.cleanPhone(user.userID);
            api.makeAPIRequest('createUser', "POST", user).then(function(data){
                resolve(data);
            }, function(err){
                reject(err);
            });
        });
    };

    static saveGoal = (goal) => {
        return new Promise(function(resolve, reject){
            api.makeAPIRequest('saveGoal', "POST", goal).then(function(data){
                resolve(data);
            }, function(err){
                reject(err);
            });
        }); 
    };

    static saveBook = (book) => {
        return new Promise(function(resolve, reject){
            api.makeAPIRequest('saveBook', "POST", book).then(function(data){
                resolve(data);
            }, function(err){
                reject(err);
            });
        });    
    }
    
    static removeBook = (bookID, userID) => {
        return new Promise(function(resolve, reject){
            api.makeAPIRequest('removeBook', "POST", {bookID, userID: api.cleanPhone(userID)}).then(function(data){
                resolve(data);
            }, function(err){
                reject(err);
            });
        });
    }

    static saveFriend = (friend) => {
        return new Promise(function(resolve, reject){
            friend.userID = api.cleanPhone(friend.userID);
            friend.friendID = api.cleanPhone(friend.friendID);
            api.makeAPIRequest('saveFriend', "POST", friend).then(function(data){
                resolve(data);
            }, function(err){
                reject(err);
            });
        });      
    }

    static removeFriend = (friendID, userID) => {
        return new Promise(function(resolve, reject){
            api.makeAPIRequest('removeFriend', "POST", {friendID: api.cleanPhone(friendID), userID: api.cleanPhone(userID)}).then(function(data){
                resolve(data);
            }, function(err){
                reject(err);
            });
        });
    }

    static getUser = (userID) => {
        return new Promise(function(resolve, reject){
            api.makeAPIRequest('getUser/' + api.cleanPhone(userID)).then(function(data){
                resolve(data);
            }, function(err){
                reject(err);
            });
        });
    }

    static getAuthenticatedUser = () => {
        return new Promise(function(resolve, reject){
            api.makeAPIRequest('getAuthenticatedUser').then(function(data){
                resolve(data);
            }, function(err){
                reject(err);
            });
        });
    }

    static makeAPIRequest = (url, type = "GET", data = null) => {
        return new Promise(function(resolve, reject){
            AsyncStorage.getItem("token").then(function(token){
                let options = {
                    method: type,
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    }                    
                };
                if(token != undefined && token != null){
                    options.headers["Authorization"] = "Bearer " + token;
                }
                if(data != null){
                    options.body = JSON.stringify(data);
                }
                fetch(params.apiUrl + url, options).then(response => response.json())
                    .then(responseJson => { 
                        resolve(responseJson);
                    })
                    .catch(err => {
                        reject(err);
                    });
            }, function(err){
                reject(err);
            });
        });
    }

    static cleanPhone = (number) => {
        const chars = number.split('');
        let num = "";
        for(const n of chars){
            const p = parseInt(n);
            if(p != isNaN && p >= 0){
                num += n;
            }
        }
        return num;

        /*const replaceChars = ["(", ")", "-", " "];
        for(const r of replaceChars){
            number = number.replace(r, "");
        }
        if(parseInt(number) == isNaN){
            return number.slice(0, 2) + number.slice(4);
        }
        else{
            return number;
        }*/
    };
}