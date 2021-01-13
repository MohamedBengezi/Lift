import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  Dimensions
} from "react-native";
import colors from '../hooks/colors'

import { WebView } from "react-native-webview";
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

  function VideoElement({ vid }) {
    return (
      <View style={styles.post}>
        <WebView
          source={{
            html: `<!DOCTYPE html>
            <html>
            <head>
                <title></title>
            </head>
            <body>
            <video id=${count} preload autoplay="false" src=${vid.item} controls="true" style="width: 50; height: 150">
            </video>
            </body>
            </html>`,
          }}
          style={styles.video}
        />
      </View>
    );
  }

  function ImageElement({ image }) {
    return (
      <View style={styles.post}>
        <Text style={{ marginLeft: 50 }}>{title}</Text>
        <Image source={{ uri: image.item.uri }} style={styles.video} />
      </View>
    );
  }

  function renderPost(item) {
    //check if video or photo
    let media;
    if (typeof item.item === 'object' && item.item !== null) {
      media = <ImageElement image={item} />
    } else {
      media = <VideoElement vid={item} />

    }
    return (
      <TouchableOpacity style={{ margin: 10, borderRadius: 4 }} onPress={() => onPress(media)}>
        <PostDetails media={media} title={title} showComments={false} />
      </TouchableOpacity>
    )
  }

  const onPress = (media) => {
    navigate("ViewPost", { media, title })
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
  },
  post: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    width: "70%",
    height: "50%"
  },
  video: {
    width: Dimensions.get('window').width - 20,
    height: 125,
    resizeMode: "cover",
  }

});
export default Feed;
