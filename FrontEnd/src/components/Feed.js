import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,

} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import colors from '../hooks/colors'
import { navigate } from "../navigationRef";
import PostDetails from "./PostDetails";


const Feed = ({ posts, isFeedback }) => {
  const [listOfPosts, setList] = useState(null);

  useEffect(() => {
    if (listOfPosts) return;
    setList(posts);

  }, [listOfPosts]);

  let count = 0;

  function renderPost(item) {

    return (
      <TouchableOpacity style={{ margin: 10, borderRadius: 4 }} onPress={() => onPress(item)}>
        <PostDetails item={item} showComments={false} isFeedback={isFeedback} />
      </TouchableOpacity>
    )
  }

  const onPress = (item) => {
    navigate("ViewPost", { item, isFeedback })
  }

  function ListOfPosts() {

    return (
      <FlatList
        data={listOfPosts}
        renderItem={(item) => renderPost(item)}
        keyExtractor={() => "post:" + count++}
      />
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.background}>
      <ListOfPosts />
    </ScrollView >

  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: colors.white,
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
  }

});
export default Feed;
