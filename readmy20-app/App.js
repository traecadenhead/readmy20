import React from 'react';
import { StackNav } from './config/router';
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

  updateGoal = (goal) => {
    this.setState({
      goal
    });
  }

  render() {

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
}