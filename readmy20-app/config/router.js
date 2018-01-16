import React from 'react';
import { StackNavigator } from 'react-navigation';
import BookList from '../screens/BookList';
import Search from '../screens/Search';
import BookDetail from '../screens/BookDetail';
import Settings from '../screens/Settings';
import Friends from '../screens/Friends';
import SignIn from '../screens/SignIn';
import CreateAccount from '../screens/CreateAccount';

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
    },
    Friends: {
        screen: Friends
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