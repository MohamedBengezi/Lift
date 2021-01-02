import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { WebView } from "react-native-webview";
import serverApi from "../api/server";

const apiLink = serverApi.defaults.baseURL;

const FeedScreen = ({ navigation }) => {
  let image = null,
    video = null,
    count = 0;
  const [play, setPlay] = useState(false);
  url = apiLink + "/sample";

  let img = (navigation.getParam('image')) ? navigation.getParam('image') : null;
  let title = (navigation.getParam('title')) ? navigation.getParam('title') : "this is a post";
  console.log("AAA1", navigation)

  if (url != "" && img == null) {
    video = [url, url, url, url];
  } else {
    image = [img, img, img, img];
    //  image = navigation.state.params.image
  }

  function VideoElement({ vid }) {
    return (
      <View style={styles.post}>
        <Text>{title}</Text>
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
          style={{ width: 300, height: 150, borderWidth: 2 }}
        />
        <LikeAndComment />

      </View>
    );
  }

  function ImageElement({ image }) {
    return (
      <View style={styles.post}>
        <Text>{title}</Text>
        <Image source={{ uri: image.item.uri }} style={{ width: 300, height: 150, borderWidth: 2 }} />
        <LikeAndComment />
      </View>
    );
  }

  function LikeAndComment() {
    return (
      <View style={styles.icons}>
        <TouchableOpacity style={styles.icons}>
          <Ionicons
            name="md-heart"
            style={styles.iconStyle}
            onPress={() => {
              console.log("Like!")
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons
            name="md-chatbubbles"
            style={styles.iconStyle}
            onPress={() => {
              console.log("Comment!")
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  const renderVid = (vid) => (
    <TouchableOpacity style={styles.container} onPress={() => viewVidPost(vid)}>
      <VideoElement vid={vid} />
    </TouchableOpacity>
  );

  const renderImage = (image) => (
    <TouchableOpacity style={styles.container} onPress={() => viewImagePost(image)}>
      <ImageElement image={image} />
    </TouchableOpacity>

  );

  function viewVidPost(item) {
    let post = <VideoElement vid={item} />
    navigation.navigate("ViewPost", { post })
  }

  function viewImagePost(item) {
    let post = <ImageElement image={item} />
    navigation.navigate("ViewPost", { post })
  }


  function VideoPost() {
    return (
      <FlatList
        data={video}
        renderItem={(vid) => renderVid(vid)}
        keyExtractor={(vid) => vid + count++}
      />
    );
  };

  function ImagePost() {
    return (
      <FlatList
        data={image}
        renderItem={(photo) => renderImage(photo)}
        keyExtractor={(photo) => photo.uri + count++}
      />
    );

  }
  let posts;
  if (video) {
    posts = <VideoPost />
  } else {
    posts = <ImagePost />
  }

  return (
    <View style={styles.background}>
      {posts}
    </View >

  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#ffffff",
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  container: {
    alignItems: "center",
    marginTop: 20,
    borderRadius: 1,
    borderWidth: 2,
    borderColor: "black",
  },
  post: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    width: "70%",
    height: "50%"
  },
  icons: {
    flex: 1,
    flexDirection: 'row',
    fontSize: 200,
    alignItems: 'flex-start'
  },
  iconStyle: {
    position: "relative",
    fontWeight: "600",
    fontSize: 25,
    marginRight: 5
  }
});
export default FeedScreen;
