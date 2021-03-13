import React from "react";
import {  StyleSheet,Image } from "react-native";

const ViewImageScreen = ({navigation}) => {
  return <Image source={{ uri: navigation.state.params.uri }} style={styles.image} />;
};

const styles = StyleSheet.create({
 image:{
    aspectRatio:1.5
 }
});
export default ViewImageScreen;
