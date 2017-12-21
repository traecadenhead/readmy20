import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { Constants, Facebook } from 'expo';

export default class BookDetail extends Component{     

        static navigationOptions = () => ({
            title: "Log In"
        });

        handleFacebookLogin = async () => {

            try {
              const { type, token } = await Facebook.logInWithReadPermissionsAsync(
                '412946149122408', // Replace with your own app id in standalone app
                { permissions: ['public_profile', 'email'], behavior: 'web' }
              );
        
              switch (type) {
                case 'success': {
                  // Get the user's name using Facebook's Graph API
                  const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
                  const profile = await response.json();
                  this.props.screenProps.storeFacebookUser(profile);
                  break;
                }
                case 'cancel': {
                  Alert.alert(
                    'Cancelled!',
                    'Login was cancelled!',
                  );
                  break;
                }
                default: {
                  Alert.alert(
                    'Oops!',
                    'Login failed!',
                  );
                }
              }
            } catch (e) {
                console.error(e);
              Alert.alert(
                'Oops!',
                'Login failed!',
              );
            }
          };
    
        render(){

            return (
                <View style={styles.container}>
                    <Text style={styles.text}>
                        To use this app, first you'll need to log in.
                    </Text>
                    <Button 
                        title="Log In with Facebook"
                        style={styles.button}
                        onPress={this.handleFacebookLogin}
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
        button: {
            flex: 1,
            marginTop: 20
        }
    })