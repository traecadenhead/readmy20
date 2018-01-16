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
        if(this.state.userID == null || this.state.userID == ''){
            Alert.alert("You forgot to enter your username.");
        }
        if(this.state.password == null || this.state.password == ''){
            Alert.alert("You forgot to enter your password.");
        }
        else{
            this.props.screenProps.loginUser(this.state);
        }
    };

    openCreateAccount = () => {
        this.props.navigation.navigate('CreateAccount');
    };

    render(){

        return (
            <View style={styles.container}>
                <View style={styles.item}>
                    <Text style={styles.text}>
                        Phone Number
                    </Text>
                    <TextInput 
                        style={styles.input}
                        onChangeText={(userID) => this.setState({userID})}
                    />
                </View>
                <View style={styles.item}>
                    <Text style={styles.text}>
                        Password
                    </Text>
                    <TextInput 
                        style={styles.input}
                        onChangeText={(password) => this.setState({password})}
                    />
                </View>
                <View style={styles.item}>
                    <Button 
                        title="Log In"
                        style={styles.button}
                        onPress={this.login}
                    />
                </View>
                <View style={styles.item}>
                    <Button
                        title="Create Account"
                        style={styles.create}
                        onPress={this.openCreateAccount}
                    />
                </View>
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
    item: {
        flex: 1,
        marginBottom: 20
    },
    text: {            
        flex: 0,
        marginBottom: 20,
    },
    input: {
        flex: 0,
        height: 40,
        borderWidth: 1,
        paddingLeft: 10,
        backgroundColor: 'white'
    },
    button: {
        flex: 1,
        marginTop: 20
    }
})