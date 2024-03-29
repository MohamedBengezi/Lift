import React, { useContext, useEffect } from "react";
import { StyleSheet, Image, SafeAreaView } from "react-native";
import { Context as AuthContext } from "../context/AuthContext";
import colors from "../hooks/colors";

const LoadingScreen = () => {
  const { tryLocalSignin } = useContext(AuthContext);
  useEffect(() => { tryLocalSignin() }, []);
  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.logo} source={require("../../assets/icon.png")} />
    </SafeAreaView>
  );
};

LoadingScreen.navigationOptions = () => {
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
  logo: {
    flex: 0.25,
    height: "25%",
    width: "40%",
    marginBottom: "15%",
  },
});

export default LoadingScreen;
