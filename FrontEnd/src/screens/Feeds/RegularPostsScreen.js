import React, { useState, useContext, useEffect } from "react";
import {
    StyleSheet,
    SafeAreaView,
    RefreshControl,
    ScrollView
} from 'react-native';
import Feed from '../../components/Feed';
import PostDetail from '../../components/PostDetails';

import { Context as PostsContext } from '../../context/AuthContext';


const wait = timeout => {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
};


const RegularPostsScreen = ({ navigation }) => {
    const { state, getGeneralPosts } = useContext(PostsContext);
    const [posts, setPosts] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getGeneralPosts(setPosts);
        wait(2000).then(() => {
            setRefreshing(false);
        });
    }, []);


    useEffect(() => {
        getGeneralPosts(setPosts)
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
        <SafeAreaView style={styles.background}>
            <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                {posts ? (
                    <Feed posts={posts} isFeedback={false} />
                ) : <PostDetail item={dummyInfo} showComments={false} />}
            </ScrollView>
        </SafeAreaView>

    );
};

const styles = StyleSheet.create({

});

export default RegularPostsScreen; 