import React, { Component, PropTypes } from 'react';
import { FlatList, StyleSheet, Text, View, Button } from 'react-native';
import Book from '../components/Book';
import EmptyBook from '../components/EmptyBook';
import Progress from '../components/Progress';

export default class BookList extends Component{

    static navigationOptions = () => ({
        title: "My Book List"
    });

    renderItem = ({item}) => {
        if(item.book != null){
            return (
                <Book status={item.status} number={item.number} book={item.book} openDetail={this.openDetail} updateBook={this.updateBook}/>
            )
        }
        else{
            return (
                <EmptyBook number={item.number} findBook={this.findBook}/>
            )
        }
    }

    openDetail = (book, status) => {
        this.props.navigation.navigate('Detail', { book, status: status });
    }

    openSettings = () => {
        this.props.navigation.navigate('Settings');
    }

    findBook = () => {
        this.props.navigation.navigate('Search');
    }

    updateBook = (book, status) => {
        this.props.screenProps.updateBook(book, status);
    }

    render(){
        return (
            <View style={styles.container}>
                <Progress 
                    books={this.props.screenProps.books} 
                    goal={this.props.screenProps.goal}
                    openSettings={this.openSettings}
                />
                <FlatList
                    style={styles.list}
                    data={this.props.screenProps.books}
                    renderItem={this.renderItem}
                    keyExtractor={item => item.number}
                />                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'column'
    },
    list: {
        flex: 1
    }
})