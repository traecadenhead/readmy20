import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';

export default class Book extends Component{

    openDetail = () => {
        this.props.openDetail(this.props.book, this.props.status);
    }

    addBook = () => {
        this.props.addBook(this.props.book);
    }

    updateBook = (status) => {
        this.props.updateBook(this.props.book, status);
    }

    render(){
        let button = null;
        if(this.props.number == null){
            button = <Entypo name="add-to-list" size={32} color="skyblue" style={styles.button} onPress={ () => this.addBook() } />
        }
        else{
            if(this.props.status == "Complete"){
                button = <MaterialCommunityIcons name="checkbox-marked-outline" size={32} color="skyblue" style={styles.button} onPress={() => this.updateBook("Incomplete")} />
            }
            else if(this.props.status == "Incomplete"){
                button = <MaterialCommunityIcons name="checkbox-blank-outline" size={32} color="skyblue" style={styles.button} onPress={() => this.updateBook("Complete")} />
            }
            else if(this.props.status == "Recommended"){
                button = <Entypo name="add-to-list" size={32} color="skyblue" style={styles.button} onPress={() => this.updateBook("Incomplete")} />
            }
        }

        let number = null;
        if(this.props.number != null){
            number = <Text style={styles.number}>
                {this.props.number}
            </Text>
        }

        return (
            <View style={styles.container}>
                <View style={styles.textContainer}>
                    {number}
                    <View style={styles.bookInfo}>
                        <Text style={styles.title}>
                            {this.props.book.title}
                        </Text>   
                        <Text style={styles.author}>
                            {this.props.book.author}
                        </Text>
                    </View>
                </View>
                <View style={styles.buttons}>
                    {button}         
                    <Entypo 
                        name="forward" 
                        size={32} 
                        color="skyblue" 
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
    number: {
        fontSize: 20,
        flex: 0,
        width: 20
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