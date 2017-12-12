import React, { Component, PropTypes } from 'react';
import { FlatList, StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { Constants, BarCodeScanner, Permissions } from 'expo';
import { books } from '../config/data';
import goodreads from '../config/goodreads';
import Book from '../components/Book';

export default class Search extends Component{

    constructor(props){
        super(props);        
        this.state = {
            results: [],
            view: null,
            hasCameraPermission: null,
            scanned: false,
            query: null
        };
    }

    static navigationOptions = () => ({
        title: "Add a Book"
    });

    requestCameraPermission = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
            hasCameraPermission: status === 'granted',
        });
    };    

    addBook = (book) => {
        this.props.screenProps.addBook(book);
        this.props.navigation.goBack();
    }

    openDetail = (book) => {
        this.props.navigation.navigate('Detail', { book });
    }

    searchTitles = () => {
        let text = this.state.query;
        goodreads.search(text).then(function(results){
            this.setState({results})
        }.bind(this), function(err){
            console.error(err);
        });

        /*let results = [];
        if(text != null){
            text = text.trim();
            for (const book of books){
                let result = book.title.toLowerCase().indexOf(text.toLowerCase());
                if(result < 0){
                    result = book.author.toLowerCase().indexOf(text.toLowerCase());
                }
                if(result >= 0){
                    results.push(book);
                }
            }
        }
        ;*/
    }

    setView = (view) => {
        this.setState({view});
        if(view == "Scan"){
            this.requestCameraPermission();        
        }
    }

    searchCode = ({type, data}) => {
        goodreads.search(data).then(function(results){
            this.setState({results, scanned: true})
        }.bind(this), function(err){
            console.error(err);
        });
    }

    renderItem = ({item}) => {
        return (
            <Book book={item} openDetail={this.openDetail} addBook={this.addBook}/>
        )
    }

    render(){ 
        if(this.state.view == null){
            return (
                <View style={styles.container}>
                    <Button 
                        title="Search by Title" 
                        style={styles.button}
                        onPress={() => this.setView('Search')}
                    />
                    <Button 
                        title="Scan Book Code" 
                        style={styles.button}
                        onPress={() => this.setView('Scan')}
                    />
                </View>
            )
        }
        else if (this.state.view == "Search"){
            return (
                <View style={styles.container}>
                    <Text style={styles.text}>
                        Search by title for a book you would like to add to your list.
                    </Text>     
                    <TextInput 
                        style={styles.input}    
                        autoFocus={true}
                        onChangeText={(query) => this.setState({query})}
                        returnKeyType={'done'} 
                    />    
                    <Button
                        title="Search"
                        style={styles.button}
                        onPress={() => this.searchTitles()}
                    />  
                    <FlatList
                        style={styles.list}
                        data={this.state.results}
                        renderItem={this.renderItem}
                        keyExtractor={item => item.isbn}
                    />
                </View>
            )
        }
        else if (this.state.view == "Scan"){
            if(this.state.scanned){
                return (
                    <View style={styles.container}>
                        <FlatList
                            style={styles.list}
                            data={this.state.results}
                            renderItem={this.renderItem}
                            keyExtractor={item => item.isbn}
                        />
                        <Button 
                            title="Scan Another Code" 
                            style={styles.button}
                            onPress={() => this.setState({scanned: false})}
                        />
                    </View>
                )
            }
            else{
                return (                
                    <View style={styles.container}>
                        <Text style={styles.text}>
                            Scan the barcode of a book you want to read.
                        </Text> 
                        {this.state.hasCameraPermission === null ?
                            <Text>Requesting for camera permission</Text> :
                            this.state.hasCameraPermission === false ?
                                <Text>Camera permission is not granted</Text> :
                                <BarCodeScanner 
                                    onBarCodeRead={(result) => this.searchCode(result)}
                                    style={{ height: 250, width: 250 }}
                                />
                        }                        
                    </View>
                )
            }
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: 20
    },
    text: {
        flex: 0,                
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 20
    },
    input: {
        height: 40,
        width: 300,
        borderWidth: 1,
        paddingLeft: 10
    },
    list: {
        flex: 1,
        marginTop: 20
    },
    button: {
        flex: 1,
        marginBottom: 20
    }
})