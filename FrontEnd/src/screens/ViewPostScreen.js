import React from 'react';
import PostDetails from '../components/PostDetails';

const ViewPostScreen = ({ navigation }) => {

    const item = navigation.getParam('item');
    const title = navigation.getParam('title');
    return (
        <PostDetails item={item} title={title} showComments={true} />
    );
};

export default ViewPostScreen;