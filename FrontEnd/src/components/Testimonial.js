import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../hooks/colors";
import ImageElement from "./ImageElement";
import Spacer from "../components/Spacer";
import Ionicons from "react-native-vector-icons/Ionicons";
import { navigate }  from "../navigationRef";

const STAR_SIZE = 45;
const Testimonial = ({ reviewInfo, route }) => {
  const goFullScreen_beforePicture = () => {
    navigate('ViewImage',{uri:reviewInfo.beforeMediaPath});
  }
  const goFullScreen_afterPicture = () => {
    navigate('ViewImage',{uri:reviewInfo.afterMediaPath});
  }
  return (
    <View style={styles.plans}>
      <View style={styles.headingContainer}>
        <Text style={styles.weekday}>{reviewInfo.username}</Text>
        <View style={styles.stars}>
          {[...Array(reviewInfo.rating)].map((e, i) => (
            <Ionicons
              name="md-star"
              color={colors.yellow}
              type="ionicon"
              size={STAR_SIZE}
            />
          ))}
        </View>
      </View>

      <Text style={styles.reviewText}>"{reviewInfo.text}"</Text>
      <Spacer />
      <View style={styles.container}>
        <TouchableOpacity activeOpacity={0.8} onPress={goFullScreen_beforePicture}>
          <ImageElement
            image={reviewInfo.beforeMediaPath}
            route={route}
            title={"Before picture:"}
            route={route}
            style={{ with: 20 }}
          />
        </TouchableOpacity>
        <Spacer />
        <TouchableOpacity activeOpacity={0.8} onPress={goFullScreen_afterPicture}>
          <ImageElement
            image={reviewInfo.afterMediaPath}
            route={route}
            title={"After picture:"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  plans: {
    backgroundColor: colors.lighterGrey,
    borderRadius: 20,
    width: "100%",
    flex: 1,
    marginBottom: 20,
  },
  tableStyle: {
    borderColor: "transparent",
  },
  container: {
    padding: 16,
    paddingTop: 0,
    flexDirection: "row",
  },
  head: {
    height: 40,
  },
  headerText: { margin: 6, fontWeight: "bold" },
  text: { margin: 6 },
  weekday: {
    padding: 16,
    fontSize: 20,
    fontWeight: "bold",
  },
  reviewText: {
    fontSize: 15,
    fontStyle: "italic",
    paddingLeft: 16,
    paddingRight: 16,
  },
  headingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stars: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginRight:5
  },
});
export default Testimonial;
