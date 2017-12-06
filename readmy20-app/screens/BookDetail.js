import React, { Component, PropTypes } from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';

export default class BookDetail extends Component{     
    
        static navigationOptions = ( {navigation}) => ({
            title: navigation.state.params.book.title
        });

        addBook = (book) => {
            this.props.screenProps.addBook(book);
            this.props.navigation.navigate('BookList');
        }

        removeBook = (book) => {
            this.props.screenProps.removeBook(book);
            this.props.navigation.navigate('BookList');
        }

        updateBook = (book, status) => {
            this.props.screenProps.updateBook(book, status);
            this.props.navigation.navigate('BookList');
        }
    
        render(){

            const book = this.props.navigation.state.params.book;
            const status = this.props.navigation.state.params.status;

            let button = null;
            if(status != null){
                if(status == 'Recommended'){
                    button = <Entypo name="add-to-list" size={32} color="green" style={styles.button} onPress={ () => this.updateBook(book, 'Incomplete') } />
                }
                else{
                    button = <MaterialCommunityIcons name="playlist-remove" size={32} color="green" style={styles.button} onPress={ () => this.removeBook(book) } />
                }
            }
            else {                
                button = <Entypo name="add-to-list" size={32} color="green" style={styles.button} onPress={ () => this.addBook(book) } />
            }

            return (
                <View style={styles.container}>
                    <View style={styles.imageContainer}>
                        <Image source={{uri: book.imageUrl}} style={styles.image}/>
                        {button}
                    </View>
                    <ScrollView style={styles.textContainer}>
                        <Text style={styles.title}>
                            {book.title}
                        </Text>
                        <Text style={styles.author}>
                            {book.author}
                        </Text>
                        <Text style={styles.rating}>
                            Rating: {book.rating}
                        </Text>
                        <Text style={styles.text}>
                            {book.description}
                        </Text>
                    </ScrollView>
                </View>
            )
        }
    }
    
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            marginTop: 20,
            marginLeft: 20,
            marginRight: 20,
            marginBottom: 20,
            flexDirection: 'row'          
        },
        imageContainer: {
            flexDirection: 'column',
            flex: 0,
            height: 200,
            justifyContent: 'flex-start',
            alignItems: 'center'
        },
        image: {
            flex: 1,
            width: 100,
            height: 150,
            resizeMode: 'contain'
        },
        button: {
            marginTop: 20
        },
        textContainer: {
            flexDirection: 'column',
            flex: 1,
            marginLeft: 20
        },
        text: {            
            flex: 1,
            marginTop: 20
        },
        title: {
            fontSize: 22,
            fontWeight: 'bold'
        },
        author: {
            fontSize: 18
        },
        rating: {
            fontSize: 14,
            fontWeight: 'bold'
        }
    })