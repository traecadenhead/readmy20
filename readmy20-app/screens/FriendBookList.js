import React, { Component, PropTypes } from 'react';
import { FlatList, StyleSheet, Text, View, Button } from 'react-native';
import FriendBook from '../components/FriendBook';
import FriendProgress from '../components/FriendProgress';
import api from '../config/api';

export default class FriendBookList extends Component{

    constructor(props){
        super(props);        
        this.state = {
            user: {},
            books: [],
            goal: 20
        };
    };

    static navigationOptions = ({navigation}) => ({
        title: navigation.state.params.friendName + " Book List"
    });

    componentDidMount(){
        setTimeout(() => this.getUser(), 1);
    };

    getUser = () => {
        api.getUser(this.props.navigation.state.params.friendID).then(function({user, goal, books}){
            this.setState({user, goal: goal.number, books});
        }.bind(this));
    };

    renderItem = ({item}) => {
        return (
            <FriendBook book={item.book} status={item.status} openDetail={this.openDetail}/>
        )
    }

    openDetail = (book) => {
        this.props.navigation.navigate('Detail', { book });
    }

    render(){
        return (
            <View style={styles.container}>
                <FriendProgress 
                    books={this.state.books} 
                    goal={this.state.goal}
                />
                <FlatList
                    style={styles.list}
                    data={this.state.books}
                    renderItem={this.renderItem}
                    keyExtractor={item => item.bookID}
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