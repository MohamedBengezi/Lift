import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Directions, FlingGestureHandler, State } from 'react-native-gesture-handler';
import Ionicons from "react-native-vector-icons/Ionicons";
import { Context as AuthContext } from "../../context/AuthContext";
import PlanList from '../../components/PlanList';
import colors from '../../hooks/colors';


const FollowedPlansScreen = ({ navigation }) => {
    const { state } = useContext(AuthContext);
    const [count, setCount] = useState(0)

    const refreshPlans = () => {
        setCount(count + 1);
    }

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
                <Ionicons
                    name='md-refresh'
                    size={25}
                    color={colors.black}
                    style={{ alignSelf: 'center', marginTop: '1%' }}
                    onPress={refreshPlans}
                />
                <PlanList navigation={navigation} plans={state.workout_plans} />

            </View>
        </FlingGestureHandler>
    );
};

const styles = StyleSheet.create({

});

export default FollowedPlansScreen;