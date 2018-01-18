import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, Picker } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default class FriendProgress extends Component{

    render(){
        let completed = 0;
        for(const book of this.props.books){
            if(book.status == "Complete"){
                completed++;
            }
        }

        return (
            <View style={styles.container}>
                <Text style={styles.completed}>
                    {completed}
                </Text>
                <Text style={styles.of}>
                    /
                </Text> 
                <Text style={styles.goal}>
                    {this.props.goal}
                </Text>  
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
        width: Dimensions.get('window').width
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
    goal: {
        flex: 0,
        fontSize: 20
    },
    button: {
        marginLeft: 10,
        flex: 0
    }
})