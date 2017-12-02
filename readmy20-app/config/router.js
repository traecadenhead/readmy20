import React from 'react';
import { StackNavigator } from 'react-navigation';
import BookList from '../screens/BookList';
import Search from '../screens/Search';

export const StackNav = StackNavigator({
    BookList: {
        screen: BookList,
        navigationOptions: {
            title: 'My Book List'
        }
    },
    Search: {
        screen: Search,
        navigationOptions: {
            title: 'Find a Book'
        }
    }
});
