import React, { useContext, useState } from "react";
import { View, StyleSheet } from "react-native";
import PlanItem from "../../components/PlanItem";
import DayWorkout from "../../components/DayWorkout";
import colors from "../../hooks/colors";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native";
import { Button } from "react-native-elements";
import { TouchableOpacity } from "react-native";
import { Context as AuthContext } from "../../context/AuthContext";


const ViewPlanScreen = ({ navigation }) => {
  let plan = navigation.getParam("plan");
  const { state, modifyUserInfo } = useContext(AuthContext);
  let isFollowing = navigation.getParam("isFollowing");
  let [currentDay, setCurrentDay] = useState(plan.id in state.plan_tracker ? state.plan_tracker[plan.id] : 0);


  function renderPlan(item) {
    if (!item) return null;

    //turning each exercise string into an array for DayWorkout to render
    let workouts = item.item.exercises;
    for (var i = 0; i < workouts.length; i++) {
      if (typeof workouts[i] === "string") {
        workouts[i] = workouts[i].split(",");
        workouts[i].splice(1, 1);
      }
    }
    return (
      <TouchableOpacity onPress={() => onPress(item.index)}>
        <DayWorkout weekday={item.item.dayoftheweek} program={workouts} id={item.index} currentDay={currentDay} isFollowing={isFollowing} />
      </TouchableOpacity>
    );
  }

  const onPress = (index) => {
    if (currentDay != index) {
      setCurrentDay(index); AuthContext
      state.plan_tracker[plan.id] = index;
      modifyUserInfo({ updatedUsername: state.username, bio: state.userInfo.bio, plan_tracker: state.plan_tracker })
    }
  }

  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={{
          backgroundColor: colors.white,
          height: "100%"
        }}
      >
        <View style={{ flex: 1, alignItems: "center" }}>
          <PlanItem plan={plan} navigation={navigation} />
          <FlatList
            data={plan.days}
            renderItem={(item) => renderPlan(item)}
            keyExtractor={(item) => item.week_number + item.dayoftheweek + ""}
            scrollEnabled={true}
            contentContainerStyle={{ marginTop: 5, paddingBottom: "20%" }}
          />
          <Button
            title={"See Reviews"}
            onPress={() => {
              navigation.navigate("ViewTestimonials", { plan: plan });
            }}
            buttonStyle={styles.button}
            titleStyle={styles.buttonText}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 120,
    borderRadius: 5,
    backgroundColor: colors.yellow,
    marginVertical: 5
  },
  buttonText: {
    color: colors.black,
    flex: 1,
  }
});

export default ViewPlanScreen;
