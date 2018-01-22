import React from 'react';
import { Alert, AsyncStorage } from 'react-native';
import { LoginNav, StackNav } from './config/router';
import api from './config/api';
import appState from './config/appState';

export default class App extends React.Component {

  constructor(props){
    super(props);
    this.state = appState.getInitialState(); 
  }

  componentDidMount(){
    appState.loadAuthenticatedUser().then(function(data){
      this.establishUser(data);
    }.bind(this), function(err){
      // user is not authenticated
    });
  };

  createUser = (userToCreate) => {
    appState.createUser(userToCreate).then(function(data){
      this.establishUser(data);
    }.bind(this), function(err){
      Alert.alert("Your account couldn't be created with the info you provided.");
    });
  };

  loginUser = (logInUser) => {
    appState.loginUser(loginUser).then(function(data){
      this.establishUser(data);
    }.bind(this), function(err){
      Alert.alert("You couldn't be logged in with the info you provided.");
    });
  };

  establishUser = (data) => {
    this.setState({user: data.user, friends: data.friends});
    appState.createBookList(data.goal.number, data.books).then(function({goal, books}){
      this.setState({
        goal,
        books
      });
    }.bind(this));
  };

  signOut = () => {
    appState.signOutUser().then(function(){
      this.setState({
        user: null,
        goal: null,
        books: [],
        friends: []
      });
    }.bind(this), function(err){
      console.log(err);
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
  };

  addFriend = (friend) => {
      let friends = this.state.friends;
      friends.push(friend);
      this.setState({friends});
  }; 

  removeFriend = (phone) => {
    let friends = [];
    for(const item of this.state.friends){
      if(item.friendID != api.cleanPhone(phone)){
        friends.push(item);
      }
    }
    this.setState({friends});
    api.removeFriend(phone, this.state.user.userID);
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