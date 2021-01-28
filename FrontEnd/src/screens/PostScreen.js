import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, TextInput, Image } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Button } from "react-native-elements";
import { Video } from "expo-av";
import { Context as AuthContext } from "../context/AuthContext";
import colors from "../hooks/colors";

const PostScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [postType, setPostType] = useState("feedback");
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
        <View style={styles.previewContainer}>
          <Image source={{ uri: image.uri }} style={styles.preview} />
        </View>
      );
    }
  };

  const onSubmit = () => {
    const data = {
      caption: title,
      type: postType,
    };

    if (video != null) {
      uploadPost({ ...data, media: video });
      navigation.navigate("FeedbackFeed", { video, title });
    } else {
      uploadPost({ ...data, media: image });
      navigation.navigate("FeedbackFeed", { image, title });
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", flexDirection: "column" }}>
      {renderCapture()}
      <TextInput
        style={styles.titleInput}
        value={title}
        onChangeText={(text) => setTitle(text)}
        placeholder="Caption"
      />
      <View style={styles.labelAndDropView}>
        <Text style={styles.label}>POST TYPE:</Text>
        <Picker
          selectedValue={postType}
          style={{ height: 50, width: "40%", borderWidth: 1 }}
          onValueChange={(itemValue, itemIndex) => setPostType(itemValue)}
        >
          <Picker.Item label="Feedback" value="feedback" />
          <Picker.Item label="Regular" value="regular" />
        </Picker>
      </View>

      <Button
        title="POST"
        onPress={() => {
          onSubmit();
        }}
        buttonStyle={styles.button}
        titleStyle={styles.buttonText}
        containerStyle={styles.containerStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  titleInput: {
    borderBottomWidth: 1,
    width: "80%",
    fontSize: 15,
    marginTop: "5%",
  },
  preview: {
    alignItems: "center",
    height: "100%",
    width: 250,
    resizeMode: "cover",
  },
  button: {
    backgroundColor: colors.blue,
    width: "50%",
    borderRadius: 5,
  },
  containerStyle: {
    justifyContent: "center",
    alignItems: "center",
    flex: 0.15,
  },
  buttonText: {
    color: colors.black,
    flex: 1,
    fontSize: 20,
  },
  previewContainer: {
    borderWidth: 1,
    flex: 0.5,
    marginTop: "5%",
  },
  labelAndDropView: {
    flexDirection:"row",
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "10%",
    width: "100%",
  },
  label: {
    fontSize: 20,
    textDecorationColor: colors.black,
    fontWeight:"bold"
  },
});

export default PostScreen;
