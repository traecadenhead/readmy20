import React from 'react';
import { StackNavigator } from 'react-navigation';
import BookList from '../screens/BookList';
import Search from '../screens/Search';
import BookDetail from '../screens/BookDetail';

export const StackNav = StackNavigator({
    BookList: {
        screen: BookList
    },
    Search: {
        screen: Search
    },
    Detail: {
        screen: BookDetail
    }
});
