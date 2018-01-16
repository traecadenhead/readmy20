import React from 'react';
import { Alert } from 'react-native';
import { LoginNav, StackNav } from './config/router';
import api from './config/api';

export default class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      user: null,
      goal: null,
      books: [],
      friends: []
    }; 
  }

  componentDidMount(){
    this.loginUser({
      userID: '9019216800',
      password: 'test',
      loginType: 'phone'
    });
  };

  addBook = (book) => {
    let books = [];
    let bookToSave = null;
    for(const item of this.state.books){
      if(item.book == null && bookToSave == null){
        item.bookID = book.isbn;
        item.userID = this.state.user.userID;
        item.book = book;
        item.status = "Incomplete";
        bookToSave = item;
      }
      books.push(item);
    }
    this.setState({
      books
    });
    if(bookToSave != null){
      api.saveBook(bookToSave);
    } 
  };

  removeBook = (book) => {
    let books = [];
    for(const item of this.state.books){
      if(item.book != null && item.book.isbn == book.isbn){
        item.book = null;
      }
      books.push(item);
    }
    api.createBookList(this.state.goal, books).then(function({goal, books}){
      this.setState({books});
    }.bind(this));
    api.removeBook(book.isbn, this.state.user.userID);
  };

  updateBook = (book, status) => {
    let books = [];
    let bookToSave = null;
    for(const item of this.state.books){
      if(item.book != null && item.book.isbn == book.isbn){
        item.status = status;
        bookToSave = item;
      }      
      books.push(item);
    }
    this.setState({
      books
    });
    if(bookToSave != null){
      api.saveBook(bookToSave);
    }
  };

  updateGoal = (goalNumber) => {
    api.createBookList(goalNumber, this.state.books).then(function({goal, books}){
      this.setState({goal, books});
      api.saveGoal({number: goal, userID: this.state.user.userID});
    }.bind(this));    
  }

  storeFacebookUser = (fbUser) => {
    api.establishUser({userID: fbUser.id, name: fbUser.name, loginType: "Facebook"}).then(function({user, goal, books}){
      this.setState({user});
      api.createBookList(goal.number, books).then(function({goal, books}){
        this.setState({
          goal,
          books
        });
      }.bind(this));
    }.bind(this));    
  }; 

  loginUser = (logInUser) => {
    api.loginUser(logInUser).then(function({user, goal, books, friends}){
      if(user != undefined && user != null){
        this.setState({user, friends});
        api.createBookList(goal.number, books).then(function({goal, books}){
          this.setState({
            goal,
            books
          });
        }.bind(this));
      }
      else{
        Alert.alert("You couldn't be logged in with the info you provided.");
      }
    }.bind(this)); 
  };

  addFriend = (friend) => {
      let friends = this.state.friends;
      friends.push(friend);
      this.setState({friends});
  }; 

  removeFriend = (phone) => {
    let friends = [];
    for(const item of this.state.friends){
      if(item.friendID != phone){
        friends.push(item);
      }
    }
    this.setState({friends});
    api.removeFriend(phone, this.state.user.userID);
  };

  signOut = () => {
    this.setState({
      user: null,
      goal: null,
      books: [],
      friends: []
    });
  };

  render() {

    if(this.state.user != null){
      const propsForScreen = {
        user: this.state.user,
        books: this.state.books,
        goal: this.state.goal,
        friends: this.state.friends,        
        textFriend: this.state.textFriend,
        addBook: this.addBook,
        removeBook: this.removeBook,
        updateBook: this.updateBook,
        updateGoal: this.updateGoal,
        addFriend: this.addFriend,
        removeFriend: this.removeFriend,
        signOut: this.signOut
      };

      return (      
        <StackNav screenProps={propsForScreen}/>
      );
    }
    else{
      const propsForScreen = {
        storeFacebookUser: this.storeFacebookUser,
        loginUser: this.loginUser
      };

      return (
        <LoginNav screenProps={propsForScreen}/>
      );
    }
  }
}