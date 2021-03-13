import React, { useReducer } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import PlanItem from "../../components/PlanItem";
import DayWorkout from "../../components/DayWorkout";
import colors from "../../hooks/colors";
import Ionicons from "react-native-vector-icons/Ionicons";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native";
import { Button } from "react-native-elements";

const ViewPlanScreen = ({ navigation }) => {
  let plan = navigation.getParam("plan");
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
    return <DayWorkout weekday={item.item.dayoftheweek} program={workouts} />;
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
  },
  icon: {
    color: colors.black,
    fontWeight: "600",
    fontSize: 50,
  },
  cancel: {
    width: 50,
    height: 50,
    paddingTop: StatusBar.currentHeight,
    marginBottom: 50,
  },
});

export default ViewPlanScreen;
