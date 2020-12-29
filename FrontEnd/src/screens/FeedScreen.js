import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { Video } from "expo-av";
import { Context } from "../components/context/CreateContext";
import CardComponent from "../components/common/CardComponent";
import { ScrollView } from "react-native-gesture-handler";
import Ionicons from "react-native-vector-icons/Ionicons";
import { WebView } from "react-native-webview";
import serverApi from "../api/server";
import { navigate } from "../navigationRef";

const apiLink = serverApi.defaults.baseURL;

const FeedScreen = ({ navigation }) => {
  let image = null,
    video = null,
    count = 0;
  const [play, setPlay] = useState(false);
  url = apiLink + "/sample";

  image = Image.resolveAssetSource(require("../../assets/icon.png"));

  if (url != "") {
    video = [url, url, url, url];
  }

  function VidPost({ vid }) {
    return (
      <View style={styles.post}>
        <Text>this is a video post</Text>

        <WebView
          source={{
            html: `<!DOCTYPE html>
            <html>
            <head>
                <title></title>
            </head>
            <body>
            <video id=${count} preload autoplay="false" src=${vid.item} controls="true">
            </video>
            </body>
            </html>`,
          }}
          style={{ width: 300, height: 300 }}
        />
      </View>
    );
  }

  function ImgPost() {
    return (
      <View>
        <Text>this is an image post</Text>
        <Image source={{ uri: image.item.uri }} style={styles.post} />
      </View>
    );
  }

  const renderVid = (vid) => (
    <TouchableOpacity style={styles.container} onPress={() => viewVidPost(vid)}>
      <VidPost vid={vid} />
    </TouchableOpacity>
  );


  function viewVidPost(item) {
    console.log("YYY0 ", item)
    let post = <VidPost vid={item} />
    navigation.navigate("ViewPost", { post })
  }

  const renderImage = (image) => (
    <TouchableOpacity style={styles.container} onPress={navigate("Main")}>
      <Text>this is an image post</Text>
      <Image source={{ uri: image.item.uri }} />
    </TouchableOpacity>

  );

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
    <FlatList
      data={image}
      renderItem={(photo) => renderImage(photo)}
      keyExtractor={(photo) => photo.uri + count++}
    />
  }
  let posts;
  if (video) {
    posts = <VideoPost />
  } else {
    posts = <ImagePost />
  }

  return (
    <View style={styles.background}>
      <ScrollView>
        {posts}
      </ScrollView>
    </View>

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
});
export default FeedScreen;
