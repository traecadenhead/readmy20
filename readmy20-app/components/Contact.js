import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';

export default class Contact extends Component{

    addFriend = () => {
        this.props.addFriend(this.props.contact);
    }

    removeFriend = () => {
        this.props.removeFriend(this.props.contact);
    }

    render(){
        let button = null;
        if(!this.props.contact.isFriend){
            button = <Entypo name="add-to-list" size={32} color="skyblue" style={styles.button} onPress={ () => this.addFriend() } />
        }
        else{
            button = <MaterialCommunityIcons name="playlist-remove" size={32} color="skyblue" style={styles.button} onPress={ () => this.removeFriend() } />
        }

        return (
            <View style={styles.container}>
                <View style={styles.textContainer}>
                    <View style={styles.bookInfo}>
                        <Text style={styles.title}>
                            {this.props.contact.name}
                        </Text>   
                        <Text style={styles.author}>
                            {this.props.contact.phone}
                        </Text>
                    </View>
                </View>
                <View style={styles.buttons}>
                    {button}  
                </View>                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        backgroundColor: 'white',
        flexDirection: 'column',
        borderBottomWidth: 5,
        borderBottomColor: 'pink',
        flex: 1,
        width: Dimensions.get('window').width
    },
    textContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flex: 1,
        paddingRight: 20,
        width: Dimensions.get('window').width
    },
    bookInfo: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start'
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