import React from "react";
import { View, StyleSheet, Image, SafeAreaView, StatusBar } from "react-native";
import { Button } from "react-native-elements";
import { navigate } from "../navigationRef";
import colors from "../hooks/colors";

const IntroScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.logo} source={require("../../assets/icon.png")} />
      <Button
        title="Sign Up"
        onPress={() => navigate("Signup")}
        buttonStyle={styles.button}
        titleStyle={styles.buttonText}
        containerStyle={styles.containerStyle}
      />
      <Button
        title="Login"
        onPress={() => navigate("Signin")}
        buttonStyle={styles.button}
        titleStyle={styles.buttonText}
        containerStyle={styles.containerStyle}
      />
    </SafeAreaView>
  );
};

IntroScreen.navigationOptions = () => {
  return {
    header: () => false,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.blue,
    alignItems: "center",
  },
  button: {
    backgroundColor: colors.yellow,
    width: "40%",
    height: "40%",
    borderRadius: 10,
  },
  containerStyle: {
    justifyContent: "center",
    flex: 0.15,
  },
  buttonText: {
    flex: 1,
    color: colors.black,
  },
  logo: {
    flex: 0.25,
    height: "25%",
    width: "40%",
    marginBottom: "15%",
  },
});

export default IntroScreen;
