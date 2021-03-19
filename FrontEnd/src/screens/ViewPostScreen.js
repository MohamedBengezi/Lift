import React from 'react';
import PostDetails from '../components/PostDetails';
import {
    StyleSheet,
    StatusBar,
    ScrollView
} from "react-native";
import colors from '../hooks/colors'
const ViewPostScreen = ({ navigation }) => {

    const item = navigation.getParam('item');

    return (
        <ScrollView keyboardShouldPersistTaps='never' contentContainerStyle={{ flex: 1 }}>


            <PostDetails item={item} showComments={true} />

        </ScrollView>
    );
};
const styles = StyleSheet.create({
    icon: {
        color: colors.black,
        fontWeight: "600",
        fontSize: 50,
    },
    cancel: {
        position: "absolute",
        left: 20,
        top: StatusBar.currentHeight,
        width: 50,
        height: 50,
        backgroundColor: "red"
    }
});

export default ViewPostScreen;