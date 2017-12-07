import React from 'react';
import { LoginNav, StackNav } from './config/router';
import { userData } from './config/data';

export default class App extends React.Component {

  constructor(props){
    super(props);
    this.state = userData;
  }

  addBook = (book) => {
    let books = [];
    let bookAdded = false;
    for(const item of this.state.books){
      if(item.book == null && !bookAdded){
        item.book = book;
        item.status = "Incomplete";
        bookAdded = true;
      }
      books.push(item);
    }
    this.setState({
      books
    })
  };

  removeBook = (book) => {
    let books = [];
    for(const item of this.state.books){
      if(item.book != null && item.book.id == book.id){
        item.book = null;
      }
      books.push(item);
    }
    this.setState({
      books
    })
  };

  updateBook = (book, status) => {
    let books = [];
    for(const item of this.state.books){
      if(item.book != null && item.book.id == book.id){
        item.status = status;
      }      
      books.push(item);
    }
    this.setState({
      books
    })
  };

  updateGoal = (newGoal) => {
    let goal = newGoal;
    //rebuild the list to match the number for the goal
    let books = [];
    let i = 0;
    for(const item of this.state.books){   
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
    this.setState({
      goal,
      books
    });
  }

  storeUser = (user) => {
    this.setState({user});
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
        storeUser: this.storeUser
      };

      return (
        <LoginNav screenProps={propsForScreen}/>
      );
    }
  }
}