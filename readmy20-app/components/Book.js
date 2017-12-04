import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, View, TextInput } from 'react-native';
import { Entypo } from '@expo/vector-icons';

export default class Book extends Component{

    openDetail = () => {
        this.props.openDetail(this.props.book);
    }

    render(){
        let addButton = null;
        if(!this.props.book.inList){
            addButton = <Entypo name="add-to-list" size={32} color="green" style={styles.button} />
        }

        return (
            <View style={styles.container}>
                <Text style={styles.title}>
                    {this.props.book.title}
                </Text>   
                <Text style={styles.author}>
                    {this.props.book.author}
                </Text>
                <View style={styles.buttons}>
                    {addButton}             
                    <Entypo 
                        name="forward" 
                        size={32} 
                        color="green" 
                        style={styles.button} 
                        onPress={ () => this.openDetail() }
                    />
                </View>                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        marginBottom: 5,
        backgroundColor: 'skyblue'
    },
    title: {
        fontWeight: 'bold'
    },
    author: {
        fontStyle: 'italic'
    },
    buttons: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'flex-end'
    },
    button: {
        marginTop: 20,
        marginLeft: 20
    }
})