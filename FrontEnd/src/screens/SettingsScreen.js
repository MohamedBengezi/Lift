import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, Image, Alert } from "react-native";
import { Input, Button } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import { navigate } from "../navigationRef";
import colors from "../hooks/colors";
import { Context as AuthContext } from "../context/AuthContext";
import property from "../property.json";
import qs from "qs";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import axios from "axios";

const SettingsScreen = ({ navigation }) => {
  const { signout, saveFitbitToken, state, addProfilePicture, modifyUserInfo } = useContext(
    AuthContext
  );
  const [image, setImage] = useState(null);
  const [userInfo, setUserInfo] = useState({ updatedUsername: "", bio: "" });

  useEffect(() => {
    async () => {
      if (Platform.OS !== "web") {
        const {
          status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    };
  });
  // getFitbitInfo();



  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const saveUserInfo = () => {
    if (!image || userInfo.updatedUsername == "" && userInfo.bio == "" || userInfo.updatedUsername.trim() == state.username.trim()) {
      return Alert.alert(
        "Must input a new username or bio",
        "At least one input field can't be empty! If updating username it must be different from current one",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ],
        { cancelable: false }
      );
    } else {
      addProfilePicture({ uri: image });
      state.username = userInfo.updatedUsername;
      modifyUserInfo(userInfo);
      navigation.goBack();
    }
  }

  WebBrowser.maybeCompleteAuthSession();
  let discovery = {
    authorizationEndpoint: "https://www.fitbit.com/oauth2/authorize",
  };
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: property.client_id,
      scopes: ["heartrate", "activity"],
      responseType: "token",
      redirectUri: "exp://192.168.0.107:19000",
      extraParams: { expires_in: "31536000" },
      prompt: "consent",
    },
    discovery
  );
  /* console.log(request);
  const getHeartRate = async (token) => {
    const api = axios.create({
      baseURL:
        "https://api.fitbit.com/1/user/-/activities/date",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const fitbitResponse = await api.get("/2021-3-2.json");
    console.log(fitbitResponse.headers);
    console.log("Line after api call");
  }; */

  useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;
      if (access_token && !state.isFitbitLinked) {
        saveFitbitToken(access_token);
      }
      /**
       * Test code to see if you can make an api call using axios and above access_token
       */
      // getHeartRate(access_token);
    }
  }, [response]);

  return (
    <View style={styles.background}>
      <Ionicons
        name="ios-arrow-round-back"
        style={styles.cancel}
        onPress={() => {
          navigate("Profile");
        }}
      />
      <View style={styles.usernameContainer}>
        <Text style={{ marginBottom: 5, marginLeft: 10 }}>Username: </Text>
        <Input style={styles.username}
          value={userInfo.updatedUsername}
          onChangeText={(username) => setUserInfo({ ...userInfo, updatedUsername: username })}
          placeholder="Enter new username"
        />
      </View>
      <View>
        <Text style={{}}>Profile Picture: </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {image && (
            <Image source={{ uri: image }} style={styles.profilePicture} />
          )}
          <Ionicons
            name="md-add-circle"
            color={colors.black}
            type="ionicon"
            size={35}
            style={{ marginLeft: 10 }}
            onPress={pickImage}
          />
        </View>
      </View>
      <View style={styles.usernameContainer}>
        <Text style={{ marginBottom: 5, marginLeft: 10 }}>Bio: </Text>
        <Input
          style={styles.username}
          value={userInfo.bio}
          onChangeText={(bio) => setUserInfo({ ...userInfo, bio: bio })}
          placeholder="Enter new bio"
        />
      </View>

      <Button
        title="Save"
        onPress={() => {
          saveUserInfo();
        }}
        buttonStyle={styles.button}
        titleStyle={styles.buttonText}
        containerStyle={styles.containerStyle}
      />

      <Button
        title="Link Fitbit Account"
        onPress={() => {
          if (!state.isFitbitLinked) {
            promptAsync();
          } else {
            Alert.alert(
              "Fitbit",
              "Fitbit Account already linked!",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
              ],
              { cancelable: true }
            );
          }
        }}
        buttonStyle={styles.button}
        titleStyle={styles.buttonText}
        containerStyle={styles.containerStyle}
      />

      <Button
        title="Logout"
        onPress={() => {
          signout();
          console.log("logged out");
        }}
        buttonStyle={styles.button}
        titleStyle={styles.buttonText}
        containerStyle={styles.containerStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.blue,
    alignItems: "center",
    justifyContent: "center",
  },
  cancel: {
    position: "absolute",
    left: 20,
    top: 40,
    color: colors.black,
    fontWeight: "600",
    fontSize: 28,
  },
  usernameContainer: {
    width: "50%",
  },
  username: {
    backgroundColor: colors.white,
    borderRadius: 9,
  },
  profilePicture: {
    width: 130,
    height: 130,
    borderRadius: 70,
    borderWidth: 1,
    marginTop: 10,
  },
  button: {
    backgroundColor: colors.yellow,
    width: "70%",
    borderRadius: 5,
  },
  containerStyle: {
    justifyContent: "center",
    alignItems: "center",
    flex: 0.25,
  },
  buttonText: {
    color: colors.black,
    flex: 1,
  },
});

export default SettingsScreen;
