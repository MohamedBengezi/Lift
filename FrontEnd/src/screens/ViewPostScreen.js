import React from 'react';
import PostDetails from '../components/PostDetails';
import { StyleSheet, ScrollView } from "react-native";
const ViewPostScreen = ({ navigation }) => {

    const item = navigation.getParam('item');

    return (
        <ScrollView keyboardShouldPersistTaps='never' contentContainerStyle={{ flex: 1 }}>
            <PostDetails item={item} showComments={true} />
        </ScrollView>
    );
};
const styles = StyleSheet.create({

});

export default ViewPostScreen;