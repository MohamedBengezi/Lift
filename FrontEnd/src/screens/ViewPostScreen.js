import React from 'react';
import PostDetails from '../components/PostDetails';
import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    ScrollView
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import colors from '../hooks/colors'
const ViewPostScreen = ({ navigation }) => {

    const item = navigation.getParam('item');
    const isFeedback = navigation.getParam('isFeedback');

    return (
        <ScrollView keyboardShouldPersistTaps='never' contentContainerStyle={{ flex: 1 }}>


            <PostDetails item={item} showComments={true} isFeedback={isFeedback} />

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