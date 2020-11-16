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

const HomeScreen = ({ route, navigation }) => {
  let image = null, video = null, count = 0;
  const [play, setPlay] = useState(false);
  url = "http://0dcbc9672557.ngrok.io/sample";

  if (route.params == undefined) {
    image = Image.resolveAssetSource(require("../../assets/icon.png"));
  } else {
    image = [route.params.image, route.params.image, route.params.image, route.params.image];
  }
  if (url != "") {
    video = [url, url, url, url];
  }

  const renderVid = (vid) =>
    <View style={styles.container}>
      <ScrollView>
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
      </ScrollView>
    </View>

  const renderImage = (image) =>
    <View style={styles.container}>
      <Text>this is an image post</Text>
      <Image
        source={{ uri: image.item.uri }}
        style={styles.post}
      />
    </View>


  if (video) {
    return (
      <View style={styles.background}>
        <ScrollView>
          <FlatList
            data={video}
            renderItem={vid => renderVid(vid)}
            keyExtractor={vid => vid + count++}
          />
        </ScrollView>
      </View >
    );
  } else {
    return (
      <View style={styles.background}>
        <ScrollView>
          <FlatList
            data={image}
            renderItem={photo => renderImage(photo)}
            keyExtractor={photo => photo.uri + count++}
          />

        </ScrollView>
      </View >
    );
  }
};

const styles = StyleSheet.create({
  flip: {
    fontSize: 28,
    marginTop: 30,
    marginRight: 30,
    color: "black",
  },
  background: {
    backgroundColor: "#ffffff",
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  container: {
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 1,
    borderWidth: 2,
    borderColor: 'black',

  },
  row: {
    height: 100,
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingVertical: 20,
    alignItems: "center",
  },
  col: {
    flexDirection: "column",
  },
  title: {
    fontSize: 15,
    paddingLeft: 10,
    textAlign: "left",
    fontWeight: "bold",
    color: "#003f5c",
    marginTop: 15,
  },
  icon: {
    fontSize: 27,
    paddingRight: 10,
  },
  chatIcon: {
    width: 70,
    height: 70,
    marginLeft: 14,
    borderWidth: 1,
  },
  chatName: {
    fontSize: 18,
    paddingLeft: 10,
    fontWeight: "bold",
    color: "#000000",
  },
  lastSent: {
    paddingLeft: 10,
    color: "#808080",
  },
  lastSentTime: {
    color: "#808080",
    alignSelf: "flex-end",
    flex: 1,
    margin: 10,
  },
});
export default HomeScreen;
