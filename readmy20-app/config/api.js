const apiRoot = 'http://52.26.132.42:3000/';

export default class api{

    static establishUser = (user) => {
        return new Promise(function(resolve, reject){
            fetch(apiRoot + 'establishuser', {
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

    static createBookList = (userGoal, userBooks) => {
        return new Promise(function(resolve, reject){
          try{
            let goal = userGoal;
            //rebuild the list to match the number for the goal
            let books = [];
            let i = 0;
            for(const item of userBooks){   
                i++;
                item.number = i;
                books.push(item);        
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

    static saveGoal = (number, userID) => {
        return new Promise(function(resolve, reject){
            fetch(apiRoot + 'savegoal', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({number, userID})
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
            fetch(apiRoot + 'savebook', {
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
            fetch(apiRoot + 'removebook', {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({bookID, userID}),
              }).then(response => response.json())
              .then(response => { 
                resolve(responseJson);
              })
              .catch(err => {
                reject(err);
              });
          });
      }
}