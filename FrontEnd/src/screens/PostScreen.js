import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, TextInput, Image, ScrollView } from "react-native";
import { Button } from "react-native-elements";
import { Video } from "expo-av";
import { Context as AuthContext } from "../context/AuthContext";
import colors from "../hooks/colors";
import DropDownPicker from 'react-native-dropdown-picker';

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
        <View style={styles.previewContainer}>
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
      uploadPost({ ...data, media: video, isVideo: true });
      navigation.navigate("FeedbackFeed", { video, title });
    } else {
      uploadPost({ ...data, media: image, isVideo: false });
      navigation.navigate("FeedbackFeed", { image, title });
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flex: 1, alignItems: "center", flexDirection: "column", marginTop: "5%" }} keyboardShouldPersistTaps='never'>
      {renderCapture()}
      <TextInput
        style={styles.titleInput}
        value={title}
        onChangeText={(text) => setTitle(text)}
        placeholder="Caption"
      />
      <View style={styles.labelAndDropView}>
        <Text style={styles.label}>POST TYPE: </Text>
        <DropDownPicker
          items={[
            { label: 'Feedback', value: 'feedback', hidden: true },
            { label: 'Regular', value: 'regular' },
          ]}
          defaultValue={postType}
          style={{ width: 150, borderWidth: 1 }}
          itemStyle={{
            justifyContent: 'flex-start'
          }}
          labelStyle={{ color: colors.black }}
          onChangeItem={item => setPostType(item.value)}
        />
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
    </ScrollView>
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
    width: "90%",
    borderRadius: 5,
  },
  containerStyle: {
    position: 'absolute',
    bottom: 100,
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
    flexDirection: "row",
    flex: 0.1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "10%",
    width: "100%",
  },
  label: {
    fontSize: 20,
    textDecorationColor: colors.black,
    fontWeight: "bold"
  },
});

export default PostScreen;
