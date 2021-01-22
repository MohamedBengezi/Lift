import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, TextInput, Image } from "react-native";
import Button from "../components/common/Button";
import { Video } from "expo-av";
import { Context as AuthContext } from "../context/AuthContext";

const PostScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const { state, uploadPost } = useContext(AuthContext);
  let image = Image.resolveAssetSource(require("../../assets/icon.png")),
    video = null;
  if (navigation.getParam("video")) {
    video = navigation.getParam("video");
  } else if (navigation.getParam("image")) {
    image = navigation.getParam("image");
  }

  const renderCapture = () => {
    if (video != null) {
      return (
        <View>
          <Video
            source={{
              uri: video.uri,
            }}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="cover"
            shouldPlay
            isLooping
            style={styles.preview}
          />
        </View>
      );
    } else {
      return (
        <View>
          <Image source={{ uri: image.uri }} style={styles.preview} />
        </View>
      );
    }
  };

  const onSubmit = () => {
    const type = "feedback"; //needs to be changed so user picks whether it is feedback or regular
    const data = {
      username: state.username,
      caption: title,
      type: type,
    };

    if (video != null) {
      uploadPost({ ...data, media: video });
      navigation.navigate("Feed", { video, title });
    } else {
      uploadPost({ ...data, media: image });
      navigation.navigate("Feed", { image, title });
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", flexDirection: "column" }}>
      {renderCapture()}
      <Text style={styles.titleStyle}>Enter Caption</Text>
      <TextInput
        style={styles.titleInput}
        value={title}
        onChangeText={(text) => setTitle(text)}
        placeholder="Caption"
      />

      <Button title="Save" onPress={() => onSubmit()} />
    </View>
  );
};

const styles = StyleSheet.create({
  titleStyle: {
    marginTop: 15,
    paddingLeft: 15,
  },
  titleInput: {
    borderWidth: 1,
    width: 300,
    height: 75,
    marginBottom: 15,
  },
  preview: {
    alignItems: "center",
    height: 200,
    width: 200,
    resizeMode: "cover",
  },
});

export default PostScreen;
