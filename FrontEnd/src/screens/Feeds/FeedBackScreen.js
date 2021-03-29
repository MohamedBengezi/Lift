import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  ScrollView
} from "react-native";
import Feed from '../../components/Feed';
import { Context as PostsContext } from '../../context/AuthContext';
import PostDetail from '../../components/PostDetails';

const wait = timeout => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};

const FeedBackScreen = ({ navigation }) => {
  const { state, getUserPost, getFeedbackPosts, searchWorkoutPlans } = useContext(PostsContext);
  const [posts, setPosts] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getFeedbackPosts(setPosts);
    wait(2000).then(() => {
      setRefreshing(false);
    });
  }, []);

  useEffect(() => {
    getFeedbackPosts(setPosts);
    searchWorkoutPlans({ query: "" });
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
        {!posts || posts.length === 0 ? (
          <PostDetail item={dummyInfo} showComments={false} />
        ) : <Feed posts={posts} isFeedback={true} />}
      </ScrollView>
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({

});
export default FeedBackScreen;
