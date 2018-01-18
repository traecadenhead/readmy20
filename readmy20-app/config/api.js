import { params } from '../config/params';

export default class api{

    static establishUser = (user) => {
        user.userID = api.cleanPhone(user.userID);
        return new Promise(function(resolve, reject){
            fetch(params.apiUrl + 'establishuser', {
                    method: 'POST',
                    headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                    body: JSON.stringify(user)  
            }).then(response => response.json())
            .then(responseJson => { 
                resolve(responseJson);
            })
            .catch(err => {
                resolve(err);
            });
        });
    }

    static loginUser = (user) => {
        user.userID = api.cleanPhone(user.userID);
        return new Promise(function(resolve, reject){
            fetch(params.apiUrl + 'loginuser', {
                    method: 'POST',
                    headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                    body: JSON.stringify(user)  
            }).then(response => response.json())
            .then(responseJson => { 
                if(responseJson.user == undefined || responseJson.user == null){
                    console.warn("invalid login");
                    reject(new Error("Invalid login"));
                }
                else{
                    resolve(responseJson);
                }
            })
            .catch(err => {
                reject(err);
            });
        });
    }

    static createBookList = (userGoal, userBooks) => {
        return new Promise(function(resolve, reject){
          try{
            let goal = userGoal;
            //rebuild the list to match the number for the goal
            let books = [];
            let i = 0;
            for(const item of userBooks){ 
                if(item.book != null){  
                    i++;
                    item.number = i;
                    books.push(item);     
                }   
            }
            if(i < goal){
                while(i < goal){
                    i++;
                    const newBook = {
                        number: i
                    };
                    books.push(newBook);        
                }
            }
            else if (i > goal){
              goal = i;
            }     
            resolve({goal, books});
          }
          catch(e){
            reject(e);
          }
        });    
    };

    static saveGoal = (goal) => {
        return new Promise(function(resolve, reject){
            fetch(params.apiUrl + 'savegoal', {
                method: 'POST',
                headers: { 
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(goal)
            }).then(response => response.json())
            .then(responseJson => { 
                resolve(responseJson);
            })
            .catch(err => {
                reject(err);
            });
        });
    };

    static saveBook = (book) => {
        return new Promise(function(resolve, reject){
            fetch(params.apiUrl + 'savebook', {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(book),
              }).then(response => response.json())
              .then(responseJson => { 
                resolve(responseJson);
              })
              .catch(err => {
                reject(err);
              });
        });        
    }
    
    static removeBook = (bookID, userID) => {
        return new Promise(function(resolve, reject){
        fetch(params.apiUrl + 'removebook', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({bookID, userID}),
            }).then(response => response.json())
            .then(responseJson => { 
            resolve(responseJson);
            })
            .catch(err => {
            reject(err);
            });
        });
    }

    static saveFriend = (friend) => {
        friend.userID = api.cleanPhone(friend.userID);
        friend.friendID = api.cleanPhone(friend.friendID);
        return new Promise(function(resolve, reject){
            fetch(params.apiUrl + 'savefriend', {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(friend),
              }).then(response => response.json())
              .then(responseJson => { 
                resolve(responseJson);
              })
              .catch(err => {
                reject(err);
              });
        });        
    }

    static removeFriend = (friendID, userID) => {
        friendID = api.cleanPhone(friendID);
        userID = api.cleanPhone(userID);
        return new Promise(function(resolve, reject){
        fetch(params.apiUrl + 'removefriend', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({friendID, userID}),
            }).then(response => response.json())
            .then(responseJson => { 
                resolve(responseJson);
            })
            .catch(err => {
                reject(err);
            });
        });
    }

    static getUser = (userID) => {
        userID = api.cleanPhone(userID);
        return new Promise(function(resolve, reject){
            fetch(params.apiUrl + 'getUser/' + userID, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
                }).then(response => response.json())
                .then(responseJson => { 
                    resolve(responseJson);
                })
                .catch(err => {
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