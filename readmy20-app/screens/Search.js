import React, { Component, PropTypes } from 'react';
import { FlatList, StyleSheet, Text, View, TextInput } from 'react-native';
import { searchableBooks } from '../config/data';
import Book from '../components/Book';

const extractKey = ({id}) => id

export default class Search extends Component{

    constructor(props){
        super(props);
        this.state = {
            searchableBooks: []
        };
    }

    static navigationOptions = () => ({
        title: "Find a Book"
    });

    renderItem = ({item}) => {
        return (
            <Book book={item} openDetail={this.openDetail}/>
        )
    }

    openDetail = (book) => {
        // TO DO: pass book to the detail screen
        this.props.navigation.navigate('Detail');
    }

    searchBooks = (text) => {
        // TO DO: use this text to control search
        this.setState({searchableBooks});
    };   

    render(){ 
        return (
            <View style={styles.container}>
                <Text style={styles.text}>
                    Search by title for a book you would like to add to your list.
                </Text>     
                <TextInput 
                    style={styles.input}    
                    onSubmitEditing={(text) => this.searchBooks(text)} 
                />      
                <FlatList
                    style={styles.list}
                    data={this.state.searchableBooks}
                    renderItem={this.renderItem}
                    keyExtractor={extractKey}
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
    text: {
        flex: 0,
        marginTop: 20,        
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 20
    },
    input: {
        height: 40,
        width: 300,
        borderWidth: 1,
        paddingLeft: 10
    },
    list: {
        flex: 1
    }
})