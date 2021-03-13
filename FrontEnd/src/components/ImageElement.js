import React from "react";
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";

const ImageElement = ({ title, image, route }) => {
  return (
    <View style={styles.post}>
      <Text style={route == "ViewTestimonials" ? styles.title : null}>{title}</Text>
      <Image
        source={{ uri: image }}
        style={
          route == "ViewTestimonials" ? styles.testimonialImage : styles.image
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  post: {
    flex: 1,
  },
  image: {
    aspectRatio: 1.5,
    width: Dimensions.get("window").width - 20,
    height: 250,
  },
  testimonialImage: {
    aspectRatio: 1.5,
    width: 100,
    height: 100,
  },
  title:{
      fontSize:12,
      fontWeight:"bold"
  }
});

export default ImageElement;
