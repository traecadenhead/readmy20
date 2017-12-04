import React, { Component, PropTypes } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

export default class BookDetail extends Component{     
    
        static navigationOptions = ( {navigation}) => ({
            title: navigation.state.params.book.title
        });
    
        render(){

            const book = this.props.navigation.state.params.book;

            return (
                <View style={styles.container}>
                    <Image source={{uri: book.imageUrl}}/>
                    <Text style={styles.author}>
                        {book.author}
                    </Text>
                    <Text style={styles.rating}>
                        Rating: {book.rating}
                    </Text>
                    <Text style={styles.text}>
                        {book.description}
                    </Text>
                </View>
            )
        }
    }
    
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            marginTop: 20,
            marginLeft: 20,
            marginRight: 20
        },
        text: {            
            flex: 1,
            marginTop: 20
        },
        author: {
            fontSize: 18
        },
        rating: {
            fontSize: 14,
            fontWeight: 'bold'
        }
    })