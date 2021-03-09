import React, { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, Image, Alert } from "react-native";
import { Button } from "react-native-elements";
import colors from "../../hooks/colors";
import DropDownPicker from "react-native-dropdown-picker";
import Spacer from "../../components/Spacer";
import { navigate } from "../../navigationRef";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Context as AuthContext } from "../../context/AuthContext";

const AddTestimonialScreen = ({ navigation }) => {
  let plan = navigation.getParam("plan");
  let planID = plan.id;
  let testimonial = {
    beforeMediaPath: "",
    afterMediaPath: "",
    text: "",
    rating: 1,
    docID: planID,
  };

  const { addTestimonial } = useContext(AuthContext);

  var items = [];
  for (var i = 1; i <= 5; i++) {
    items.push({ label: i.toString(), value: i, hidden: false });
  }
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const pickBeforeImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setBeforeImage(result.uri);
    }
  };
  const pickAfterImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setAfterImage(result.uri);
    }
  };

  const checkAndSendTestimonial = () => {
    if (!beforeImage) {
      Alert.alert(
        "Before Image",
        "Please pick a before image!",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
        ],
        { cancelable: true }
      );
    } else if(!afterImage){
      Alert.alert(
        "After Image",
        "Please pick an after image!",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
        ],
        { cancelable: true }
      );
    }
    testimonial.afterMediaPath=afterImage;
    testimonial.beforeMediaPath=beforeImage;
    testimonial.text= reviewText;
    addTestimonial(testimonial);
  };
  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        alignItems: "center",
        flexDirection: "column",
        marginTop: "12%",
      }}
    >
      <Ionicons
        name="ios-arrow-round-back"
        style={styles.cancel}
        onPress={() => {
          navigation.goBack();
        }}
      />
      <Spacer />
      <TextInput
        style={styles.titleInput}
        onChangeText={(text) => {setReviewText(text);}}
        placeholder="Enter your review here"
      />

      <View style={styles.labelAndDropView}>
        <Text style={styles.label}>Rating: </Text>
        <DropDownPicker
          items={items}
          defaultValue={1}
          style={{ width: 100, borderWidth: 1 }}
          itemStyle={{
            justifyContent: "flex-start",
            color: colors.black,
          }}
          labelStyle={{ color: colors.black }}
          onChangeItem={(item) => (testimonial.rating = item.value)}
        />
      </View>
      <View style={{ ...styles.labelAndDropView, marginTop: "15%" }}>
        <Text style={styles.label}>Before Picture: </Text>
        {beforeImage && (
          <Image source={{ uri: beforeImage }} style={styles.profilePicture} />
        )}
        <Ionicons
          name="md-add-circle"
          color={colors.black}
          type="ionicon"
          size={35}
          style={{ marginLeft: 10 }}
          onPress={pickBeforeImage}
        />
      </View>
      <View style={{ ...styles.labelAndDropView, marginTop: "25%" }}>
        <Text style={styles.label}>After Picture: </Text>
        {afterImage && (
          <Image
            source={{ uri: afterImage }}
            style={{ ...styles.profilePicture, marginLeft: 5 }}
          />
        )}
        <Ionicons
          name="md-add-circle"
          color={colors.black}
          type="ionicon"
          size={35}
          style={{ marginLeft: 10 }}
          onPress={pickAfterImage}
        />
      </View>
      <Button
        title="POST RATING"
        onPress={() => {
          checkAndSendTestimonial();
        }}
        buttonStyle={styles.button}
        titleStyle={styles.buttonText}
        containerStyle={styles.addPlanStyle}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  create: {
    backgroundColor: colors.blue,
    width: "70%",
    borderRadius: 5,
  },
  button: {
    backgroundColor: colors.blue,
    width: "80%",
    borderRadius: 5,
  },
  containerStyle: {
    position: "absolute",
    top: 5,
    right: 5,
    alignItems: "center",
    flex: 0.15,
  },
  addPlanStyle: {
    position: "absolute",
    bottom: 40,
    paddingTop: "5%",
    alignItems: "center",
    flex: 0.15,
  },
  buttonText: {
    color: colors.black,
    flex: 1,
    fontSize: 15,
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
    fontWeight: "bold",
  },
  workout: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    borderRadius: 5,
    backgroundColor: colors.lightGrey,
    padding: 20,
    margin: 20,
    width: "60%",
  },
  titleInput: {
    borderBottomWidth: 1,
    width: "80%",
    fontSize: 15,
    marginTop: "5%",
  },
  profilePicture: {
    width: 130,
    height: 130,
    borderRadius: 70,
    borderWidth: 1,
    marginTop: 10,
  },
  cancel: {
    position: "absolute",
    left: 20,
    top: 5,
    color: colors.black,
    fontWeight: "600",
    fontSize: 28,
  },
});

export default AddTestimonialScreen;
