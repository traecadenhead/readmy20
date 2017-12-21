import React, { Component, PropTypes } from 'react';
import { FlatList, StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import { Constants, BarCodeScanner, Permissions } from 'expo';
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
            query: null,
            searching: false
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
        goodreads.get(book.isbn).then(function(detail){
            if(detail != null){
                this.props.screenProps.addBook(detail);
                this.props.navigation.goBack();
            }
        }.bind(this), function(err){
            console.error(err);
        });          
    }

    openDetail = (book) => {
        goodreads.get(book.isbn).then(function(detail){
            if(detail != null){
                this.props.navigation.navigate('Detail', { book: detail });
            }
        }.bind(this), function(err){
            console.error(err);
        });        
    }

    searchTitles = () => {
        this.setState({searching: true});
        let text = this.state.query;
        goodreads.search(text).then(function(results){
            this.setState({results, searching: false});
            if(results.length == 0){
                Alert.alert("Sorry", "No results were found for your search. Please try a different phrase.");
            }
        }.bind(this), function(err){
            console.error(err);
        });
    }

    setView = (view) => {
        this.setState({view});
        if(view == "Scan"){
            this.requestCameraPermission();        
        }
    }

    searchCode = ({type, data}) => {
        this.setState({searching: true, scanned: true});
        goodreads.search(data).then(function(results){            
            this.setState({results, searching: false});
            if(results.length == 0){
                Alert.alert("Sorry", "No results were found for the code you scanned. You may alternately try searching by title instead.");
            }
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
                    <View style={styles.buttonHolder}>
                        <Button 
                            title="Search by Title" 
                            onPress={() => this.setView('Search')}
                        />
                    </View>
                    <View style={styles.buttonHolder}>
                        <Button 
                            title="Scan Book Code" 
                            onPress={() => this.setView('Scan')}
                        />
                    </View>
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
                    {
                        this.state.searching ?
                        <Text style={styles.status}>Searching...</Text>
                        :
                        <View style={styles.buttonHolder}>
                            <Button
                                title="Search"
                                onPress={() => this.searchTitles()}
                            /> 
                        </View> 
                    }  
                    
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
                        {
                            this.state.searching ?
                            <Text style={styles.status}>Searching...</Text>
                            :
                            <FlatList
                                style={styles.list}
                                data={this.state.results}
                                renderItem={this.renderItem}
                                keyExtractor={item => item.isbn}
                            />
                        }
                        <View style={styles.buttonHolder}>
                            <Button 
                                title="Scan Another Code" 
                                onPress={() => this.setState({scanned: false})}
                            />
                        </View>
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
        paddingLeft: 10,
        backgroundColor: 'white'
    },
    status: {
        marginTop: 20
    },
    list: {
        flex: 1,
        marginTop: 20
    },
    buttonHolder: {
        flex: 0,
        marginBottom: 10
    }
})