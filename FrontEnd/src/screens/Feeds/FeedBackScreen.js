import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
} from "react-native";
import serverApi from "../../api/server";
import Feed from '../../components/Feed';
import { Context as PostsContext } from '../../context/AuthContext';
import PostDetail from '../../components/PostDetails';
const apiLink = serverApi.defaults.baseURL;

const FeedBackScreen = ({ navigation }) => {
  const { state, getUserPost, getFeedbackPosts } = useContext(PostsContext);
  const [posts, setPosts] = useState(null);

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
  return (
    posts ? (
      <Feed posts={posts} />
    ) : <PostDetail item={dummyInfo} showComments={false} />
  );
};

const styles = StyleSheet.create({

});
export default FeedBackScreen;
