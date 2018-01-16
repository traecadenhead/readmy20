import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default class Friends extends Component{

    openFriendsScreen = () => {
        this.props.openFriends();
    }

    render(){
        return (
            <View style={styles.container}>
                <Text style={styles.completed}>
                    {this.props.friends.length}
                </Text>
                <Text style={styles.of}>
                    friends
                </Text> 
                <MaterialCommunityIcons 
                    name="human-male-female" 
                    size={24} 
                    color="black" 
                    style={styles.button} 
                    onPress={ () => this.openFriendsScreen() }
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        backgroundColor: 'skyblue',
        flexDirection: 'row',
        justifyContent: 'center',
        flex: 0,
        width: Dimensions.get('window').width,
        borderBottomWidth: 5,
        borderBottomColor: 'pink',
    },
    completed: {
        fontSize: 20,
        flex: 0
    },
    of: {
        fontSize: 20,
        marginLeft: 3,
        marginRight: 3,
        flex: 0
    },
    button: {
        marginLeft: 10,
        flex: 0
    }
})