import React, { useReducer } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import Button from '../../components/common/Button';

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


const WorkoutPlansScreen = ({ navigation }) => {

    const onSwipeDown = (gestureState) => {
        console.log('swiped down');
        navigation.navigate('Main');
    }


    return (
        <GestureRecognizer
            onSwipeDown={() => onSwipeDown()}
            style={{ flex: 1 }}
        >
            <View>
                <Text>List Screen</Text>
            </View>
        </GestureRecognizer>
    );
};

const styles = StyleSheet.create({

});

export default WorkoutPlansScreen;