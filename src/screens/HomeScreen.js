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
  let image;
  const [play, setPlay] = useState(false);
  if (route.params == undefined || route.params.image == undefined) {
    image = Image.resolveAssetSource(require("../../assets/icon.png"));
  } else {
    image = route.params.image;
  }

  const onPress = () => {
    navigation.navigate("Profile", { name: navigation.getParam("image") });
  };

  return (
    <View style={styles.background}>
      <ScrollView>
        <WebView
          source={{
            html: `<!DOCTYPE html>
            <html>
            <head>
                <title></title>
            </head>
            <body>
            <video preload autoplay="true" src="http://db142acf3d26.ngrok.io/sample" controls="true">
            </video>
            </body>
            </html>`,
          }}
          style={{ width: 300, height: 300 }}
        />
      </ScrollView>
    </View>
  );
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
