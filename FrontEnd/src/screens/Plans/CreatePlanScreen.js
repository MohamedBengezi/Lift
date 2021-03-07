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

const CreatePlanScreen = ({ navigation }) => {
  const { state, uploadPost } = useContext(AuthContext);
  let plan = {
    id: "",
    creator_id: state.username,
    name: "",
    duration: "1 days",
    experience: "Beginner",
    goal: "strength",
    tags: "",
    days: []
  }
  var items = [];

  for (var i = 1; i <= 30; i++) {
    items.push({ label: i.toString(), value: i, hidden: false });
  }

  plan = (navigation.getParam('plan')) ? navigation.getParam('plan') : plan;


  console.log('PLAN ', plan);

  const onSubmit = () => {
    plan.tags = plan.tags.split(',');

    if (video != null) {
      uploadPost({ ...data, media: video });
      navigation.navigate("WorkoutPlans");
    } else {
      uploadPost({ ...data, media: image });
      navigation.navigate("WorkoutPlans");
    }
  };

  function renderPlan(item) {
    if (!item) return null;
    console.log('renderPlan', item)
    return (
      <DayWorkout weekday={item.item.name} program={item.item.workouts} />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, alignItems: "center", flexDirection: "column", marginTop: "12%" }}>
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
          onChangeItem={item => plan.experience = item.value}
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
      <ScrollView contentContainerStyle={{ marginTop: 15 }}>
        <FlatList
          data={plan.days}
          renderItem={(item) => renderPlan(item)}
          keyExtractor={(item) => item.week_number + item.name + ""}
        />
      </ScrollView>


      <Button
        title="ADD PLAN"
        onPress={() => {
          navigate('AddPlan', { plan: plan });
        }}
        buttonStyle={styles.button}
        titleStyle={styles.buttonText}
        containerStyle={styles.addPlanStyle}
      />
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
    bottom: 10,
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
