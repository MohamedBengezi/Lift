import React, { useReducer } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../components/common/Button';
import { navigate } from "../navigationRef";
import { WebView } from "react-native-webview";


const ViewPostScreen = (props) => {
    let post = props.navigation.state.params.post
    return (
        <View style={styles.post} >
            {post}
        </View>
    );
};

const styles = StyleSheet.create({
    post: {
        flex: 1,
        alignItems: 'center'
    },
});

export default ViewPostScreen;