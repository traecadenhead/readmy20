import React, { Component, PropTypes } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, Dimensions, Button, Linking, Platform, Alert } from 'react-native';
import Contact from '../components/Contact';
import api from '../config/api';
import { params } from '../config/params';
import { Constants, Contacts, Permissions } from 'expo';

export default class Friends extends Component{

    constructor(props){
        super(props);        
        this.state = {
            contacts: [],
            loading: true
        };
    };

    componentDidMount(){
        setTimeout(() => this.getContacts(), 1);
    };

    static navigationOptions = () => ({
        title: "My Friends"
    });

    async getContacts () {
        const permission = await Permissions.askAsync(Permissions.CONTACTS);
        if(permission.status == 'granted'){
            const contacts = await Contacts.getContactsAsync({
                fields: [
                    Contacts.PHONE_NUMBERS
                ], pageSize: 1000, pageOffset: 0
            });
            let contactList = [];
            let loadedNumbers = [];
            if(contacts.total > 0){
                let i = 0;
                for(const item of contacts.data){
                    if(item.phoneNumbers.length > 0){
                        let phone = null;
                        for(const p of item.phoneNumbers){
                            if(p.label == "iPhone"){
                                phone = p.number;
                                break;
                            }                        
                        }
                        if(phone == null){
                            for(const p of item.phoneNumbers){
                                if(p.label == "mobile"){
                                    phone = p.number;
                                    break;
                                }                        
                            }
                        }
                        if(phone == null){
                            for(const p of item.phoneNumbers){
                                if(p.label == "cell"){
                                    phone = p.number;
                                    break;
                                }                        
                            }
                        }
                        if(phone == null){
                            phone = item.phoneNumbers[0].number;
                        }
                        if(loadedNumbers.indexOf(phone) < 0){
                            let isFriend = false;
                            const cleanPhone = api.cleanPhone(phone);
                            if(cleanPhone.length == 10){
                                for(const friend of this.props.screenProps.friends){
                                    if(friend.friendID == cleanPhone){
                                        isFriend = true;
                                        break;
                                    }
                                }
                                const contact = {
                                    name: item.name,
                                    phone,
                                    isFriend,
                                    id: i
                                };
                                loadedNumbers.push(phone);
                                contactList.push(contact);
                                i++;
                            }
                        }
                    }           
                }
                // show friends first
                let items = [];
                for(const item of contactList){
                    if(item.isFriend){
                        items.push(item);
                    }
                }
                for(const item of contactList){
                    if(!item.isFriend){
                        items.push(item);
                    }
                }
                this.setState({contacts: items, loading: false});
            }
            else{
                Alert.alert("Sorry, we couldn't find any contacts.");
            }  
        }      
    };

    addFriend = (contact) => {
        let friend = {
            userID: this.props.screenProps.user.userID,
            userName: this.props.screenProps.user.userName,
            friendID: contact.phone,
            friendName: contact.name
        };
        api.saveFriend(friend).then(function(savedFriend){
        if(savedFriend.status == "Accepted"){
            this.props.screenProps.addFriend(savedFriend);
            let contacts = [];
            for(const item of this.state.contacts){
                if(api.cleanPhone(item.phone) == savedFriend.friendID){
                    item.isFriend = true;
                }
                contacts.push(item);                
            }
            this.setState({contacts});
            Alert.alert(savedFriend.friendName + " has been added to your friends list.");
        }
        else{
            const body = `I challenge you to read along with me this year on the Read My 20 app! ${params.appUrl}`;
            if(Platform.OS == 'android'){
                Linking.openURL(`sms:${friend.friendID}?body=${body}`);
            }
            else if(Platform.OS == 'ios'){
                Linking.openURL(`sms:${friend.friendID}&body=${body}`);
            }
        }
        }.bind(this));
    };

    removeFriend = (contact) => {
        this.props.screenProps.removeFriend(contact.phone);
        let contacts = [];
        for(const item of this.state.contacts){
            if(contact.phone == item.phone){
                item.isFriend = false;
            }
            contacts.push(item);
        }
        this.setState({contacts});
    };

    viewFriend = (contact) => {
        this.props.navigation.navigate('FriendBookList', {friendID: api.cleanPhone(contact.phone), friendName: contact.name});
    };

    renderItem = ({item}) => {
        return (
            <Contact contact={item} addFriend={this.addFriend} removeFriend={this.removeFriend} viewFriend={this.viewFriend} />
        )
    }

    render(){ 
        return (
            <View style={styles.container}>
                <Text style={styles.text}>
                    Click a contact to add them as a friend. If they are not a current app user, you will be prompted to text them an invite to the app.
                </Text>
                {this.state.loading 
                ?
                <Text style={styles.loading}>Loading contacts...</Text> 
                :
                <FlatList
                    style={styles.list}
                    data={this.state.contacts}
                    renderItem={this.renderItem}
                    keyExtractor={item => item.id}
                />  
                }                 
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
    loading: {
        flex: 1
    },
    list: {
        flex: 1
    }
})