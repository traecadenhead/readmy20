import React from 'react';
import { StackNavigator } from 'react-navigation';
import BookList from '../screens/BookList';
import Search from '../screens/Search';
import BookDetail from '../screens/BookDetail';
import Settings from '../screens/Settings';
import SignIn from '../screens/SignIn';

export const StackNav = StackNavigator({
    BookList: {
        screen: BookList
    },
    Search: {
        screen: Search
    },
    Detail: {
        screen: BookDetail
    },
    Settings: {
        screen: Settings
    }    
});

export const LoginNav = StackNavigator({
    SignIn: {
        screen: SignIn
    },
    CreateAccount: {
        screen: CreateAccount
    }
});