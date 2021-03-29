import React, { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { Button } from "react-native-elements";
import { Context as AuthContext } from "../../context/AuthContext";
import colors from "../../hooks/colors";
import DropDownPicker from 'react-native-dropdown-picker';
import Spacer from "../../components/Spacer";
import { navigate } from "../../navigationRef";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import DayWorkout from "../../components/DayWorkout";
import { SafeAreaView } from "react-native";
import { StatusBar } from "react-native";

const CreatePlanScreen = ({ navigation }) => {
  const { state, createWorkoutPlan } = useContext(AuthContext);
  let plan = {
    name: "",
    duration: "1 days",
    experience_level: "Beginner",
    goal: "strength",
    tags: "",
    days: []
  }
  var items = [];

  for (var i = 1; i <= 30; i++) {
    items.push({ label: i.toString(), value: i, hidden: false });
  }

  plan = (navigation.getParam('plan')) ? navigation.getParam('plan') : plan;


  

  const onSubmit = () => {
    plan.tags = plan.tags.split(',');
    createWorkoutPlan(plan);
    navigate('WorkoutPlans');
  };

  function renderPlan(item) {
    if (!item) return null;

    //turning each exercise string into an array for DayWorkout to render
    let workouts = item.item.exercises.slice()
    for (var i = 0; i < workouts.length; i++) {
      if (typeof workouts[i] === 'string') {
        workouts[i] = workouts[i].split(",")
        workouts[i].splice(1, 1);
      }
    }
    return (
      <DayWorkout weekday={item.item.dayoftheweek} program={workouts} />
    );
  }

  return (
    <SafeAreaView >
      <ScrollView contentContainerStyle={{ alignItems: "center", flexDirection: "column", marginTop: StatusBar.currentHeight + 25 }}>

        <Spacer />
        <Button
          title="CREATE"
          onPress={() => {
            onSubmit();
          }}
          buttonStyle={styles.create}
          titleStyle={styles.buttonText}
          containerStyle={styles.containerStyle}
        />

        <TextInput
          style={styles.titleInput}
          onChangeText={(text) => plan.name = text}
          placeholder="Program Name"
        />
        <View style={styles.labelAndDropView}>
          <Text style={styles.label}>Duration:  </Text>
          <DropDownPicker
            items={items}
            defaultValue={1}
            style={{ width: 60, borderWidth: 1, marginRight: 5 }}
            itemStyle={{
              justifyContent: 'flex-start', color: colors.black
            }}
            labelStyle={{ color: colors.black }}
            onChangeItem={item => plan.duration = item.value}
          />
          <DropDownPicker
            items={[
              { label: 'Days', value: 'days', hidden: true },
              { label: 'Weeks', value: 'weeks', hidden: true },
              { label: 'Months', value: 'months' },
            ]}
            defaultValue={'days'}
            style={{ width: 100, borderWidth: 1 }}
            itemStyle={{
              justifyContent: 'flex-start', color: colors.black
            }}
            labelStyle={{ color: colors.black }}
            onChangeItem={item => plan.duration = plan.duration + " " + item.value}
          />
        </View>

        <TextInput
          style={styles.titleInput}
          onChangeText={(text) => plan.tags = text}
          placeholder="Tags e.g. strength, full body, cardio"
        />

        <View style={styles.labelAndDropView}>
          <Text style={styles.label}>Experience Level:  </Text>
          <DropDownPicker
            items={[
              { label: 'Beginner', value: 'beginner', hidden: true },
              { label: 'Intermediate', value: 'intermediate' },
              { label: 'Advanced', value: 'advanced' }
            ]}
            defaultValue={'beginner'}
            style={{ width: 150, borderWidth: 1 }}
            itemStyle={{
              justifyContent: 'flex-start', color: colors.black
            }}
            labelStyle={{ color: colors.black }}
            onChangeItem={item => plan.experience_level = item.value}
          />
        </View>
        <View style={styles.labelAndDropView}>
          <Text style={styles.label}>Goal:  </Text>
          <DropDownPicker
            items={[
              { label: 'Strength', value: 'strength' },
              { label: 'Muscle Mass', value: 'muscle' },
              { label: 'Endurance', value: 'endurance' },
              { label: 'Muscle Mass + Strength', value: 'muscle_strength' },
              { label: 'Weight Loss', value: 'weightloss' }
            ]}
            defaultValue={'strength'}
            style={{ width: 150, borderWidth: 1 }}
            itemStyle={{
              justifyContent: 'flex-start', color: colors.black
            }}
            labelStyle={{ color: colors.black }}
            onChangeItem={item => plan.goal = item.value}
          />
        </View>
        <Spacer />

        <FlatList
          data={plan.days}
          renderItem={(item) => renderPlan(item)}
          keyExtractor={(item) => item.week_number + item.dayoftheweek + ""}
          scrollEnabled={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />

        <Spacer />
        <Spacer />
        <Spacer />

        <Button
          title="ADD PLAN"
          onPress={() => {
            navigate('AddPlan', { plan: plan });
          }}
          buttonStyle={styles.button}
          titleStyle={styles.buttonText}
          containerStyle={styles.addPlanStyle}
        />
      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  titleInput: {
    borderBottomWidth: 1,
    width: "80%",
    fontSize: 15,
    marginTop: "5%",
  },
  create: {
    backgroundColor: colors.blue,
    width: "60%",
    borderRadius: 5,
  },
  button: {
    backgroundColor: colors.darkGrey,
    width: "90%",
    borderRadius: 5,
  },
  containerStyle: {
    position: 'absolute',
    top: 5,
    right: 5,
    alignItems: "center",
  },
  addPlanStyle: {
    position: 'absolute',
    bottom: "4.5%",
    alignItems: "center",
  },
  buttonText: {
    color: colors.black,
    flex: 1,
    fontSize: 15,
  },

  labelAndDropView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "10%",
    width: "100%",
    height: "4%"
  },
  label: {
    fontSize: 20,
    textDecorationColor: colors.black,
    fontWeight: "bold"
  },
});

export default CreatePlanScreen;
