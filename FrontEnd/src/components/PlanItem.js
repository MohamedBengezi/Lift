import React, { useReducer, useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../hooks/colors";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Button } from "react-native-elements";
import { Context as AuthContext } from "../context/AuthContext";
import { firebaseApp } from "../../firebase";

const STAR_SIZE = 45;
const PlanItem = (props) => {
  let { plan, navigation } = props;
  let parentRoute = navigation.state.routeName;
  let mainScreen = "ViewPlan";
  const { state, unfollowWorkoutPlan, followWorkoutPlan } = useContext(
    AuthContext
  );
  let planID = plan.id;
  let rating = plan.rating;
  let uid = firebaseApp.auth().currentUser.uid;
  const [isFollowing, setIsFollowing] = useState((plan.followers) ? plan.followers.includes(uid) : false);
  return (
    <TouchableOpacity
      style={
        parentRoute == mainScreen ? styles.viewPlanContainer : styles.container
      }
      onPress={() => navigation.navigate("ViewPlan", { plan: plan, isFollowing: isFollowing })}
    >
      <View style={parentRoute == mainScreen ? { ...styles.textContainer, marginTop: 15 } : styles.textContainer}>
        <Text style={styles.title}>{plan.name}</Text>
        <Text style={styles.author}>{plan.experience_level}</Text>

        <Button
          title={!isFollowing ? "Follow" : "Unfollow"}
          onPress={() => {
            console.log("followed plan");
            if (!isFollowing) {
              followWorkoutPlan({ planID: planID })
              plan.followers.push(uid)
              state.workout_plans.push(plan)
              state.plan_tracker = { ...state.plan_tracker, planID: 0 };
            } else {
              unfollowWorkoutPlan({ planID: planID });
              plan.followers = plan.followers.filter(e => e !== uid);
              state.workout_plans = state.workout_plans.filter(e => e.id !== planID)
              delete state.plan_tracker.planID
            }
            setIsFollowing(!isFollowing);
          }}
          buttonStyle={{
            ...styles.button,
            backgroundColor: isFollowing ? colors.yellow : colors.blue,
          }}
          titleStyle={styles.buttonText}
        />
        {parentRoute == mainScreen ? (
          <Button
            title={"Give Rating"}
            onPress={() => {
              console.log("going to AddTestimonialScreen");
              navigation.navigate("AddTestimonial", { plan: plan });
            }}
            buttonStyle={{
              ...styles.button,
              backgroundColor: colors.yellow,
              width: 100,
            }}
            titleStyle={styles.buttonText}
          />
        ) : null}
      </View>

      <View style={styles.stars}>
        {[...Array(rating)].map((e, i) => (
          <Ionicons
            name="md-star"
            color={colors.yellow}
            type="ionicon"
            size={STAR_SIZE}
            key={i}
          />
        ))}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 10,
    height: 175,
    width: "100%",
    marginBottom: 20,
    justifyContent: "space-around",
    alignItems: "flex-start",
  },
  viewPlanContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    height: "20%",
    width: "100%",
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    flexDirection: "column",
    marginLeft: 10,
    marginTop: 0
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  author: {
    fontSize: 15,
  },
  stars: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginTop: 5,
    width: 80,
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
});

export default PlanItem;
