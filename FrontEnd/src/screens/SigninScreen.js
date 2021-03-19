import React, { useState, useContext } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Text, Input, Button } from "react-native-elements";
import Spacer from "../components/Spacer";
import { Context as AuthContext } from "../context/AuthContext";
import colors from "../hooks/colors";
import Ionicons from "react-native-vector-icons/Ionicons";
import { navigate } from "../navigationRef";

const SigninScreen = () => {
  const { state, signin, clearErrorMessage } = useContext(AuthContext);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  return (
    <View style={styles.container}>
      <Ionicons
        name="ios-arrow-round-back"
        style={styles.cancel}
        onPress={() => {
          clearErrorMessage();
          navigate("Intro");
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={styles.input}
        contentContainerStyle={styles.keyboardView}
      >
        <Text style={styles.label}>Email:</Text>
        <TextInput
          label="Email:"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.inputBox}
          labelStyle={styles.label}
          underlineColorAndroid="transparent"
        />
      </KeyboardAvoidingView>

      <KeyboardAvoidingView
        behavior={Platform.OS == "android" ? "padding" : "height"}
        style={styles.input}
      >
        <Text style={styles.label}>Password:</Text>
        <TextInput
          secureTextEntry
          label="Username:"
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.inputBox}
          labelStyle={styles.label}
          underlineColorAndroid="transparent"
        />
      </KeyboardAvoidingView>

      {state.errorMessage ? (
        <Text style={styles.errorMessage}>{state.errorMessage}</Text>
      ) : null}
      <Spacer>
        <Button
          title="Login"
          onPress={() => {
            signin({ email, password });
          }}
          buttonStyle={styles.button}
          titleStyle={styles.buttonText}
          containerStyle={styles.containerStyle}
        />
      </Spacer>
    </View>
  );
};

SigninScreen.navigationOptions = () => {
  return {
    header: () => false,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.blue,
    width: "100%",
    height: "100%",
    alignItems: "center",
  },
  inputBox: {
    backgroundColor: colors.white,
    borderRadius: 5,
    color: colors.black,
    borderBottomColor: colors.blue,
  },
  label: {
    color: colors.black,
    fontWeight: "normal",
  },
  input: {
    flex: 0.15,
    width: "50%",
    marginTop: "5%",
  },
  button: {
    backgroundColor: colors.yellow,
    width: "70%",
    borderRadius: 5,
  },
  containerStyle: {
    justifyContent: "center",
    flex: 0.25,
    alignItems: "center",
  },
  buttonText: {
    color: colors.black,
    flex: 1,
  },
  cancel: {
    position: "absolute",
    left: 20,
    top: 40,
    color: colors.white,
    fontWeight: "600",
    fontSize: 28,
  },
  keyboardView: {
    flex: 0.5,
    backgroundColor: colors.black,
  },
  errorMessage: {
    fontSize: 16,
    color: colors.red,
    marginLeft: 15,
    marginTop: 15,
  },
});

export default SigninScreen;
