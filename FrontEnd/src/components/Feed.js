import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,

} from "react-native";
import colors from '../hooks/colors'
import { navigate } from "../navigationRef";
import PostDetails from "./PostDetails";


const Feed = ({ posts }) => {
  const [listOfPosts, setList] = useState(null);

  useEffect(() => {
    if (listOfPosts) return;
    setList(posts);

  }, [listOfPosts]);

  let count = 0;

  function renderPost(item) {

    return (
      <TouchableOpacity style={{ margin: 10, borderRadius: 4 }} onPress={() => onPress(item)}>
        <PostDetails item={item} showComments={false} />
      </TouchableOpacity>
    )
  }

  const onPress = (item) => {
    navigate("ViewPost", { item })
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
    <View style={styles.background}>
      <ListOfPosts />
    </View >

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
