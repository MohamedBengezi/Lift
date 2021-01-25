import React, { useReducer } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../hooks/colors';
import Ionicons from "react-native-vector-icons/Ionicons";
import { createPortal } from 'react-dom';
import PlanItem from './PlanItem';

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

const STAR_SIZE = 45;
const PlanList = ({ navigation }) => {
    return (

        <View style={styles.plans}>
            <PlanItem title="POWERBUILDING" author="Jeff Bezos" navigation={navigation} />
            <PlanItem title="GAINMUSCLES" author="Mark Z" navigation={navigation} />
            <PlanItem title="WEIGHTLOSS" author="Jordy H" navigation={navigation} />

        </View>
    );
};

const styles = StyleSheet.create({
    plans: {
        margin: 20
    }
});

export default PlanList;