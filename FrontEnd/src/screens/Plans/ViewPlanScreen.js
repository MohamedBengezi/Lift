import React, { useReducer } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import PlanItem from '../../components/PlanItem';
import DayWorkout from '../../components/DayWorkout';
import colors from '../../hooks/colors';
import Ionicons from "react-native-vector-icons/Ionicons";


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
    const author = navigation.getParam('author')
    const title = navigation.getParam('title')
    let mondayPlan = [
        ['Benchpress', '3 sets', '10'],
        ['Squats', '4 sets', '5'],
        ['Deadlifts', '4 sets', '5'],
        ['Cardio', '25 mins', '1']
    ]
    let tuesdayPlan = [
        ['Flys', '5 sets', '8'],
        ['Bicep Curls', '5 sets', '10'],
        ['Tricep Extensions', '5', '7'],
    ]
    return (
        <View style={{ flex: 1, backgroundColor: colors.white }}>
            {/* <TouchableOpacity
                onPress={() => {
                    navigation.goBack();
                }}
                style={styles.cancel}

            >
                <Ionicons
                    name="ios-arrow-round-back"
                    style={styles.icon}
                />
            </TouchableOpacity> */}
            <View style={{ flex: 1, alignItems: 'center' }}>
                <PlanItem author={author} title={title} navigation={navigation} />
                <DayWorkout weekday={'Monday'} program={mondayPlan} />
                <DayWorkout weekday={'Tuesday'} program={tuesdayPlan} />
            </View>

        </View>
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