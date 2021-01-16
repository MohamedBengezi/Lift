import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  TouchableHighlight,
} from "react-native";
import { Video } from "expo-av";
import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as SplashScreen from "expo-splash-screen";
import { Context as AuthContext } from "../context/AuthContext";
import colors from "../hooks/colors";
import { firebaseApp, uploadMedia } from "../../firebase";

const MainScreen = ({ navigation }) => {
  const { state, upload } = useContext(AuthContext);
  const [camera, setCamera] = useState({
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    flashMode: "off",
  });

  const [audio, setAudio] = useState({
    hasAudioPermissions: false,
  });

  const [image, setImage] = useState(null);

  const [video, setVideo] = useState(null);

  useEffect(() => {
    async function displaySplashWhileLoading() {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn(e);
      }
      fetchPermissions();
    }
    fetchPermissions();
  }, []);

  async function fetchPermissions() {
    try {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      setCamera((prevState) => ({
        ...prevState,
        hasCameraPermission: status === "granted",
      }));
      const { status2 } = await Permissions.askAsync(
        Permissions.AUDIO_RECORDING
      );
      setAudio((prevState) => ({
        ...prevState,
        hasAudioPermissions: status2 === "granted",
      }));
    } catch (e) {
      console.warn(e);
    } finally {
      await SplashScreen.hideAsync();
    }
  }

  takePicture = () => {
    if (this.camera) {
      const options = { maxDuration: 60, mirror: true };
      this.camera.takePictureAsync({
        onPictureSaved: this.onPictureSaved,
        base64: true,
      });
    }
  };

  takeVideo = async () => {
    if (this.camera) {
      const options = { maxDuration: 60, mirror: true };
      const promise = this.camera.recordAsync(options);
      if (promise) {
        const data = await promise;
        onVideoSaved(data);
      }
    }
  };

  stopRecording = () => {
    if (this.camera) {
      this.camera.stopRecording();
    }
  };

  onPictureSaved = (photo) => {
    setImage(photo);
  };

  onVideoSaved = (video) => {
    setVideo(video);
  };

  toggleFlashLight = () => {
    //Logic to turn on & turn off flashlight
    console.log("Clicked toggle flashlight ", camera.flashMode);
    var newVal = "";
    if (camera.flashMode === "on") {
      newVal = "off";
    } else {
      newVal = "on";
    }

    setCamera((prevState) => ({
      ...prevState,
      flashMode: newVal,
    }));
  };

  toggleCamera = () => {
    //Logic to toggle camera
    console.log("Clicked toggle camera");
    setCamera((prevState) => ({
      ...prevState,
      type:
        camera.type === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back,
    }));
  };

  // const getRawMedia = async (mediaUri) => {
  //   const media = await fetch(mediaUri);
  //   return await media.blob();
  // };

  if (camera.hasCameraPermission === null) {
    return <View />;
  } else if (camera.hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  } else {
    if (image != null) {
      return (
        <View>
          <Image source={{ uri: image.uri }} style={styles.preview} />
          <Ionicons
            name="md-send"
            style={styles.post}
            onPress={() => {
              // upload({ image });
              console.log(firebaseApp.auth().currentUser);
              uploadMedia(image.uri, firebaseApp.auth().currentUser.uid).then(
                (path) => {
                  //TODO: Create post object using API route and pass in path
                  console.log(path);
                }
              );
              // let ref = firebaseApp.storage().ref();
              // ref = ref.child(
              //   "public/feedback_posts/" +
              //     firebaseApp.auth().currentUser.uid +
              //     "/myImage.jpg"
              // );
              // getRawMedia(image.uri)
              //   .then((raw) => {
              //     ref.put(raw).then((snapshot) => {
              //       console.log("Successfully uploaded to firebase!");
              //       console.log(snapshot);
              //     });
              //     navigation.navigate("Post", { image, video });
              //     setImage(null);
              //   })
              //   .catch((err) =>
              //     console.log("Raw image extraction failed: " + err)
              //   );
            }}
          />

          <Ionicons
            name="md-backspace"
            onPress={() => setImage(null)}
            style={styles.cancel}
          />

          <Ionicons
            name="md-backspace"
            onPress={() => setImage(null)}
            style={styles.cancel}
          />
        </View>
      );
    } else if (video != null) {
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
          <TouchableHighlight
            style={styles.post}
            onPress={() => {
              // upload({ video });
              let ref = firebaseApp.storage().ref();
              ref = ref.child(
                "public/feedback_posts/" +
                  firebaseApp.auth().currentUser.uid +
                  "/myVideo.mp4"
              );
              getRawMedia(video.uri).then((raw) => {
                ref.put(raw).then((snapshot) => {
                  console.log("Successfully uploaded to firebase!");
                  console.log(snapshot);
                });
                navigation.navigate("Post", { image, video });
                setVideo(null);
              });
              // navigation.navigate("Feed", { video });
              // setVideo(null);
            }}
          >
            <Ionicons name="md-send" style={styles.sendIcon} />
          </TouchableHighlight>

          <Ionicons
            name="md-backspace"
            onPress={() => setVideo(null)}
            style={styles.cancel}
          />
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera
            style={{ flex: 1 }}
            type={camera.type}
            flashMode={camera.flashMode}
            ref={(ref) => {
              this.camera = ref;
            }}
          >
            <View style={styles.menu}>
              <View style={styles.subMenu}>
                <TouchableOpacity onPress={() => toggleCamera()}>
                  <Text style={styles.button}>
                    <Ionicons name="md-reverse-camera" style={styles.button} />
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.subMenu}>
                <TouchableOpacity onPress={() => toggleFlashLight()}>
                  <Text style={styles.button}>
                    <Ionicons
                      name="md-flash"
                      style={{
                        ...styles.button,
                        color:
                          camera.flashMode === "on"
                            ? colors.white
                            : colors.black,
                      }}
                    />
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.cameraButton}>
              <TouchableHighlight
                style={styles.capture}
                onPress={takePicture}
                onLongPress={takeVideo}
                onPressOut={stopRecording}
                underlayColor="rgba(255, 255, 255, 0.5)"
              >
                <View />
              </TouchableHighlight>
            </View>
          </Camera>
        </View>
      );
    }
  }
};

MainScreen.navigationOptions = {
  title: "Lift",
  headerShown: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
  },
  preview: {
    alignItems: "center",
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    resizeMode: "cover",
  },
  capture: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 5,
    borderColor: "#FFF",
    marginBottom: 50,
    alignSelf: "center",
  },
  cancel: {
    position: "absolute",
    left: 20,
    top: 40,
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 28,
  },
  sendIcon: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 28,
  },
  post: {
    position: "absolute",
    right: 20,
    top: 40,
    width: 40,
    height: 40,
    fontSize: 28,
    color: "white",
  },
  button: {
    fontSize: 32,
    color: colors.black,
  },
  cameraButton: {
    justifyContent: "space-around",
    flexDirection: "row",
    position: "absolute",
    bottom: "0.15%",
    width: "100%",
    alignItems: "center",
  },
  menu: {
    position: "absolute",
    right: "1%",
    top: "5%",
    width: "10%",
    height: "15%",
    backgroundColor: "transparent",
    flexDirection: "column",
    backgroundColor: colors.lightGrey,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.5,
    borderRadius: 8,
  },
  subMenu: {
    flex: 0.5,
    width: "100%",
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default MainScreen;
