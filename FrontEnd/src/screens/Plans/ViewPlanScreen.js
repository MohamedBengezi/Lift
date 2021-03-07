import React, { useReducer } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import PlanItem from '../../components/PlanItem';
import DayWorkout from '../../components/DayWorkout';
import colors from '../../hooks/colors';
import Ionicons from "react-native-vector-icons/Ionicons";
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native';


const reducer = (state, action) => {
    //state object and the change to make to it. 
    //state == {counter: 0}. action == increase || change_blue || change_green : colour, payload: amt
    switch (action.type) {
        case 'change_pass':
            return { ...state, pass: action.payload };
        default:
            return state;
    }
}

const ViewPlanScreen = ({ navigation }) => {
    let plan = navigation.getParam('plan');


    function renderPlan(item) {
        if (!item) return null;

        //turning each exercise string into an array for DayWorkout to render
        let workouts = item.item.exercises
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
            <ScrollView contentContainerStyle={{ backgroundColor: colors.white }}>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <PlanItem plan={plan} navigation={navigation} />
                    <FlatList
                        data={plan.days}
                        renderItem={(item) => renderPlan(item)}
                        keyExtractor={(item) => item.week_number + item.dayoftheweek + ""}
                        scrollEnabled={false}
                        contentContainerStyle={{ paddingBottom: "30%" }}

                    />
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
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
    }
});

export default ViewPlanScreen;