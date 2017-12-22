import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Alert, TextInput } from 'react-native';

export default class SignIn extends Component{     

    constructor(props){
        super(props);        
        this.state = {
            userID: '',
            password: '',
            loginType: 'phone'
        };
    }     

    static navigationOptions = () => ({
        title: "Log In"
    });

    login = () => {
        this.props.screenProps.loginUser(this.state);
    };

    render(){

        return (
            <View style={styles.container}>
                <Text style={styles.text}>
                    Phone Number
                </Text>
                <TextInput 
                    style={styles.input}
                    onChangeText={(userID) => this.setState({userID})}
                />
                <Text style={styles.text}>
                    Password
                </Text>
                <TextInput 
                    style={styles.input}
                    onChangeText={(password) => this.setState({password})}
                />
                <Button 
                    title="Log In"
                    style={styles.button}
                    onPress={this.login}
                />
                <Button
                    title="Create Account"
                    style={styles.create}
                    onPress={this.props.navigation.navigate('CreateAccount')}
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