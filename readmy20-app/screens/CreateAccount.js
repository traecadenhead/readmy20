import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Alert, TextInput } from 'react-native';

export default class CreateAccount extends Component{     

    constructor(props){
        super(props);        
        this.state = {
            name: '',
            userID: '',
            password: '',
            loginType: 'phone'
        };
    }     

    static navigationOptions = () => ({
        title: "Create Account"
    });        

    createAccount = () => {
        if(this.state.userID == ''){
            Alert.alert("Hey Now", "Your phone number is a required field to create an account.");
        }
        else if(this.state.name == ''){
            Alert.alert("Hey Now", "Your name is a required field to create an account.");
        }
        else if(this.state.password == ''){
            Alert.alert("Hey Now", "Password is a required field to create an account.");
        }
        else{
            this.props.screenProps.loginUser(this.state);
        }
    };

    render(){
        return (
            <View style={styles.container}>
                <Text style={styles.text}>
                    Your name
                </Text>
                <TextInput 
                    style={styles.input}
                    onChangeText={(name) => this.setState({name})}
                />
                <Text style={styles.text}>
                    Your phone number (you'll use this to log in)
                </Text>
                <TextInput 
                    style={styles.input}
                    onChangeText={(userID) => this.setState({userID})}
                />
                <Text style={styles.text}>
                    Your password
                </Text>
                <TextInput 
                    style={styles.input}
                    onChangeText={(password) => this.setState({password})}
                />
                <Button 
                    title="Create Account"
                    style={styles.button}
                    onPress={this.createAccount}
                />
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
        flexDirection: 'column'          
    },
    text: {            
        flex: 1,
        marginTop: 20
    },
    input: {
        height: 40,
        width: 300,
        borderWidth: 1,
        paddingLeft: 10,
        backgroundColor: 'white'
    },
    button: {
        flex: 1,
        marginTop: 20
    }
})