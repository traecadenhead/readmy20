import React, { Component, PropTypes } from 'react';
import { StyleSheet, Text, View, TextInput, Slider, Dimensions, Button } from 'react-native';

export default class Settings extends Component{

    constructor(props){
        super(props);        
        this.state = {
            number: props.screenProps.goal
        };
    }

    static navigationOptions = () => ({
        title: "My Settings"
    });

    addBook = (book) => {
        this.props.screenProps.addBook(book);
        this.props.navigation.navigate('BookList');
    }

    updateGoal = (value) => {
        const goal = parseInt(value);
        this.props.screenProps.updateGoal(goal);
    }

    showNumber = (value) => {
        const number = parseInt(value);
        this.setState({number});
    }

    render(){ 
        return (
            <View style={styles.container}>
                <Text style={styles.text}>
                    Set your goal for how many books you want to try to read this year.
                </Text>
                <Text style={styles.number}>
                    {this.state.number}
                </Text>  
                <Slider 
                    style={styles.slider} 
                    minimumValue={1}
                    maximumValue={50}
                    value={this.props.screenProps.goal}
                    onSlidingComplete={(value) => this.updateGoal(value)}
                    onValueChange={(value) => this.showNumber(value)}
                />
                <View style={styles.buttonHolder}>
                    <Button 
                        title="Log Out" 
                        onPress={() => this.props.screenProps.signOut()}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'column'
    },
    text: {
        flex: 0,
        marginTop: 20,        
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 20
    },
    number: {
        flex: 0,
        marginBottom: 10,
        justifyContent: 'center',
        fontSize: 20
    },
    slider: {
        width: Dimensions.get('window').width,
        flex: 0,
        paddingLeft: 20,
        paddingRight: 20,
        height: 30
    },
    buttonHolder: {
        flex: 1,
        marginTop: 20
    }
})