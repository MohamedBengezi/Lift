import React, { useState, useContext, useEffect } from "react";
import { StyleSheet } from 'react-native';
import serverApi from "../../api/server";
import Feed from '../../components/Feed';
import PostDetail from '../../components/PostDetails';

import { Context as PostsContext } from '../../context/AuthContext';

const apiLink = serverApi.defaults.baseURL;

const RegularPostsScreen = ({ navigation }) => {
    url = apiLink + "/sample";
    const { state, getUserPost } = useContext(PostsContext);
    const [posts, setPosts] = useState(null);
    let img = (navigation.getParam('image')) ? navigation.getParam('image') : null;
    let title = (navigation.getParam('title')) ? navigation.getParam('title') : "this is a post";

    useEffect(() => {
        getUserPost(setPosts)
    }, []);
    let dummyInfo = {
        item: {
            username: 'Welcome',
            caption: 'Please upload a post to get started',
            mediaPath: "https://reactnative.dev/img/tiny_logo.png",
            likes: 0,
            comments_numer: 1
        }
    }
    return (
        posts ? (
            <Feed posts={posts} isFeedback={false} />
        ) : <PostDetail item={dummyInfo} showComments={false} />
    );
};

const styles = StyleSheet.create({

});

export default RegularPostsScreen; 