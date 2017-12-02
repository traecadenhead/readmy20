import React, { Component, PropTypes } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

export default class Search extends Component{

    render(){
        return (
            <View style={styles.container}>
                <Text style={styles.text}>
                    TO DO: Build out Find a Book
                </Text>                
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
        marginTop: 20,
        flex: 0
    }
})