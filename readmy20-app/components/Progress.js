import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, Picker } from 'react-native';
import { Select, Option } from 'react-native-select-list';

export default class Progress extends Component{

    updateGoal = (selected) => {
        this.props.updateGoal(selected);
    }

    render(){
        let completed = 0;
        for(const book of this.props.books){
            if(book.status == "Complete"){
                completed++;
            }
        }

        return (
            <View style={styles.container}>
                <Text style={styles.completed}>
                    {completed}
                </Text>
                <Text style={styles.of}>
                    /
                </Text> 
                <Select selectStyle={styles.goal} onSelect={(selected) => this.updateGoal(selected)}>
                    <Option value={5}>5</Option>
                    <Option value={10}>10</Option>
                    <Option value={20}>20</Option>
                </Select>       
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        backgroundColor: 'skyblue',
        flexDirection: 'row',
        justifyContent: 'center',
        flex: 0,
        width: Dimensions.get('window').width
    },
    completed: {
        fontSize: 20,
        flex: 0
    },
    of: {
        fontSize: 20,
        marginLeft: 3,
        marginRight: 3,
        flex: 0
    },
    goal: {
        flex: 1
    }
})