import React, { Component, PropTypes } from 'react';
import { FlatList, StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { Constants, BarCodeScanner, Permissions } from 'expo';
import { searchableBooks } from '../config/data';
import Book from '../components/Book';

const extractKey = ({id}) => id

export default class Search extends Component{

    constructor(props){
        super(props);        
        this.state = {
            results: [],
            view: null,
            hasCameraPermission: null,
            scanned: false
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

    searchBooks = (text) => {
        // TO DO: use this text to control search
        this.setState({results: searchableBooks});
    }

    setView = (view) => {
        this.setState({view});
        if(view == "Scan"){
            this.requestCameraPermission();        
        }
    }

    searchCode = ({type, data}) => {
        // TO DO: use this text to control search        
        this.setState({results: searchableBooks, scanned: true});
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
                        onSubmitEditing={(text) => this.searchBooks(text)}
                        returnKeyType={'search'} 
                    />      
                    <FlatList
                        style={styles.list}
                        data={this.state.results}
                        renderItem={this.renderItem}
                        keyExtractor={extractKey}
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
                            keyExtractor={extractKey}
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