import React, { useState, useEffect } from 'react';
import { StyleSheet, View, KeyboardAvoidingView } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';

const ChatScreen = ({ navigation }) => {
    const [messages, setMessages] = useState([]);
    const user = { name: navigation.getParam('name'), _id: 1 }



    return (
        <View style={{ flex: 1 }}>
            <GiftedChat
                messages={messages}
                user={user}
            />
            <KeyboardAvoidingView />
        </View>

    );

};

const styles = StyleSheet.create({

});


export default ChatScreen;
