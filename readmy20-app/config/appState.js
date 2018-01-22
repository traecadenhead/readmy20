import api from '../config/api';
import { AsyncStorage, Alert } from 'react-native';

export default class appState{

    static getInitialState = () => {
        return {
            user: null,
            goal: null,
            books: [],
            friends: []
        };
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

    static loadAuthenticatedUser = () => {
        return new Promise(function(resolve, reject){
            api.getAuthenticatedUser().then(function(data){
                if(data != null && data.user != null){
                    resolve(data);
                }
                else{
                    reject(Error("user not authenticated"));
                }
            }, function(err){
                reject(err)
            });
        });
    }

    static loginUser = (logInUser) => {
        return new Promise(function(resolve, reject){
            api.loginUser(logInUser).then(function(data){
                if(data.user != undefined && data.user != null){
                    AsyncStorage.setItem("token", data.token).then(function(){
                        resolve(data);
                    }, function(err){
                        reject(err);
                    });  
                }
                else{
                    reject(err);
                }
            }, function(err){
                reject(err);
            }); 
        });
    }

    static createUser = (userToCreate) => {
        return new Promise(function(resolve, reject){
            api.createUser(userToCreate).then(function(data){
                AsyncStorage.setItem("token", data.token).then(function(){
                    resolve(data);
                }, function(err){
                    reject(err);
                });
            }, function(err){
                reject(err);
            }); 
        });
    }

    static signOutUser = () => {
        return new Promise(function(resolve, reject){
            AsyncStorage.removeItem("token").then(function(){
                resolve();
            }, function(err){
                reject(err);
            });
        });
    };
}