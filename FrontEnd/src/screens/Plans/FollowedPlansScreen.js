import React, { useContext, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Directions, FlingGestureHandler, State } from 'react-native-gesture-handler';
import { Context as AuthContext } from "../../context/AuthContext";
import PlanList from '../../components/PlanList';


const FollowedPlansScreen = ({ navigation }) => {
    const { state } = useContext(AuthContext);
    let userPlans = (state.userInfo && state.userInfo.workout_plans) ? (state.userInfo.workout_plans) : []


    const onSwipeDown = (gestureState) => {
        navigation.navigate('Main');
    }
    return (
        <FlingGestureHandler
            direction={Directions.DOWN}
            onHandlerStateChange={({ nativeEvent }) => {
                if (nativeEvent.state === State.ACTIVE) {
                    onSwipeDown()
                }
            }}>
            <View>
                <PlanList navigation={navigation} plans={userPlans} />

            </View>
        </FlingGestureHandler>
    );
};

const styles = StyleSheet.create({

});

export default FollowedPlansScreen;