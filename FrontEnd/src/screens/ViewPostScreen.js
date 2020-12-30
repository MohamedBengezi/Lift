import React from 'react';
import { View, StyleSheet } from 'react-native';

const ViewPostScreen = ({ navigation }) => {
    console.log("XXX", navigation)
    let post = navigation.getParam('post');
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
    }
});

export default ViewPostScreen;