import React, { Component, PropTypes } from 'react';
import { FlatList, StyleSheet, Text, View, Button } from 'react-native';
import { books } from '../config/data'

const extractKey = ({id}) => id

export default class BookList extends Component{

    renderItem = ({item}) => {
        return (
            <Text style={styles.row}>
                {item.title} by {item.author}
            </Text>
        )
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
    },
    row: {
        padding: 15,
        marginBottom: 5,
        backgroundColor: 'skyblue'
    }
})