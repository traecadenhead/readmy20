import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { StackNav } from './config/router';

export default class App extends React.Component {

  render() {
    return (
      <StackNav/>
    );
  }
}