import React, { useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,

} from "react-native";
import colors from '../hooks/colors'
import { navigate } from "../navigationRef";
import PostDetails from "./PostDetails";


const Feed = ({ img, url, title }) => {
  let image = null,
    video = null,
    count = 0;
  if (img != null) {
    image = [img, img, img, img];
  } else {
    video = [url, url, url, url];
  }

  function renderPost(item) {
    return (
      <TouchableOpacity style={{ margin: 10, borderRadius: 4 }} onPress={() => onPress(item)}>
        <PostDetails item={item} title={title} showComments={false} />
      </TouchableOpacity>
    )
  }

  const onPress = (item) => {
    navigate("ViewPost", { item, title })
  }

  function ListOfPosts() {
    return (
      <FlatList
        data={(image) ? image : video}
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
