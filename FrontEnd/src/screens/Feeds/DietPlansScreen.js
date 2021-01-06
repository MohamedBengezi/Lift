import React, { useReducer } from 'react';
import { View, Text, StyleSheet } from 'react-native';


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

const DietPlansScreen = () => {
    return (
        <View>
            <Text>Diet plans Screen</Text>
        </View>
    );
};

const styles = StyleSheet.create({

});

export default DietPlansScreen; 