import React, { Component, PropTypes } from 'react';
import { FlatList, StyleSheet, Text, View, Button } from 'react-native';
import { books } from '../config/data';
import Book from '../components/Book';

const extractKey = ({id}) => id

export default class BookList extends Component{

    static navigationOptions = () => ({
        title: "My Book List"
    });

    renderItem = ({item}) => {
        return (
            <Book book={item} openDetail={this.openDetail}/>
        )
    }

    openDetail = (book) => {
        // TO DO: pass book to the detail screen
        this.props.navigation.navigate('Detail', { book });
    }

    render(){
        return (
            <View style={styles.container}>
                <FlatList
                    style={styles.list}
                    data={books}
                    renderItem={this.renderItem}
                    keyExtractor={extractKey}
                />
                <Button 
                    onPress={ () => this.props.navigation.navigate('Search')}
                    title="Find a Book"
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