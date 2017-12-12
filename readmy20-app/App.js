import React from 'react';
import { LoginNav, StackNav } from './config/router';
import api from './config/api';

export default class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      user: null,
      goal: null,
      books: []
    }; 
  }

  componentDidMount(){
    this.storeFacebookUser({
      "id": "10157423594048868",
      "name": "Trae Cadenhead",
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
    this.setState({
      books
    });
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

  render() {

    if(this.state.user != null){
      const propsForScreen = {
        books: this.state.books,
        goal: this.state.goal,
        addBook: this.addBook,
        removeBook: this.removeBook,
        updateBook: this.updateBook,
        updateGoal: this.updateGoal
      };

      return (      
        <StackNav screenProps={propsForScreen}/>
      );
    }
    else{
      const propsForScreen = {
        storeFacebookUser: this.storeFacebookUser
      };

      return (
        <LoginNav screenProps={propsForScreen}/>
      );
    }
  }
}