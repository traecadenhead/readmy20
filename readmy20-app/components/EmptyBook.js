import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { Entypo } from '@expo/vector-icons';

export default class EmptyBook extends Component{

    findBook = () => {
        this.props.findBook();
    }

    render(){
        return (
            <View style={styles.container}>
                <Text style={styles.number}>
                    {this.props.number}
                </Text>
                <View style={styles.buttons}>       
                    <Entypo 
                        name="add-to-list" 
                        size={32} 
                        color="skyblue" 
                        style={styles.button} 
                        onPress={ () => this.findBook() }
                    />
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
        width: Dimensions.get('window').width
    },
    number: {
        fontSize: 20
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