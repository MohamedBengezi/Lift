import React from 'react';
import { View, StyleSheet } from 'react-native';
import PostDetails from '../components/PostDetails';

const ViewPostScreen = ({ navigation }) => {
    const media = navigation.getParam('media');
    const title = navigation.getParam('title');

    return (
        <PostDetails media={media} title={title} />
    );
};

const styles = StyleSheet.create({

});

export default ViewPostScreen;