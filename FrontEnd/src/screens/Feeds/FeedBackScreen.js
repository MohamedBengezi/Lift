import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  ScrollView
} from "react-native";
import serverApi from "../../api/server";
import Feed from '../../components/Feed';
import { Context as PostsContext } from '../../context/AuthContext';
import PostDetail from '../../components/PostDetails';
const apiLink = serverApi.defaults.baseURL;

const wait = timeout => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};

const FeedBackScreen = ({ navigation }) => {
  const { state, getUserPost, getFeedbackPosts } = useContext(PostsContext);
  const [posts, setPosts] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getFeedbackPosts(setPosts);
    wait(2000).then(() => {
      setRefreshing(false);
    });
  }, []);

  url = apiLink + "/sample";

  let img = (navigation.getParam('image')) ? navigation.getParam('image') : null;
  let title = (navigation.getParam('title')) ? navigation.getParam('title') : "this is a post";

  useEffect(() => {
    //    getUserPost(setPosts);
    getFeedbackPosts(setPosts);
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
  console.log('Feedback', posts);

  return (
    <SafeAreaView style={styles.background}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {posts ? (
          <Feed posts={posts} isFeedback={true} />
        ) : <PostDetail item={dummyInfo} showComments={false} />}
      </ScrollView>
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({

});
export default FeedBackScreen;
