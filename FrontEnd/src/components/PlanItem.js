import React, { useReducer, useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../hooks/colors';
import Ionicons from "react-native-vector-icons/Ionicons";
import { Button } from 'react-native-elements'
import { Context as AuthContext } from "../context/AuthContext";
import { firebaseApp } from "../../firebase";

const STAR_SIZE = 45;
const PlanItem = (props) => {
    let { plan, navigation } = props;
    let parentRoute = navigation.state.routeName;
    let mainScreen = 'ViewPlan'
    const { state, unfollowWorkoutPlan, followWorkoutPlan } = useContext(AuthContext);
    let planID = plan.id
    let uid = firebaseApp.auth().currentUser.uid;
    const [isFollowing, setIsFollowing] = useState(plan.followers.includes(uid));

    return (
        <TouchableOpacity
            style={parentRoute == mainScreen ? styles.viewPlanContainer : styles.container}
            onPress={() => navigation.navigate('ViewPlan', { plan: plan })}
        >
            <View style={styles.textContainer}>
                <Text style={styles.title}>{plan.name}</Text>
                <Text style={styles.author}>{plan.experience_level}</Text>

                <Button
                    title={!isFollowing ? "Follow" : "Unfollow"}
                    onPress={() => {
                        console.log('followed plan');
                        !isFollowing ? followWorkoutPlan({ planID: planID }) : unfollowWorkoutPlan({ planID: planID })
                        setIsFollowing(!isFollowing)
                    }}
                    buttonStyle={{ ...styles.button, backgroundColor: (isFollowing) ? colors.yellow : colors.blue }}
                    titleStyle={styles.buttonText}
                />


            </View>
            <View style={styles.stars}>
                <Ionicons
                    name="md-star"
                    color={colors.yellow}
                    type="ionicon"
                    size={STAR_SIZE}
                />
                <Ionicons
                    name="md-star"
                    color={colors.yellow}
                    type="ionicon"
                    size={STAR_SIZE}
                />
                <Ionicons
                    name="md-star"
                    color={colors.yellow}
                    type="ionicon"
                    size={STAR_SIZE}
                />
                <Ionicons
                    name="md-star"
                    color={colors.yellow}
                    type="ionicon"
                    size={STAR_SIZE}
                />
                <Ionicons
                    name="md-star"
                    color={colors.yellow}
                    type="ionicon"
                    size={STAR_SIZE}
                />
            </View>

        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.lightGrey,
        borderRadius: 10,
        height: "90%",
        width: "100%",
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    viewPlanContainer: {
        backgroundColor: colors.white,
        borderRadius: 10,
        height: "22%",
        width: "100%",
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    textContainer: {
        flexDirection: 'column',
        marginLeft: 10
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    author: {
        fontSize: 15
    },
    stars: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        backgroundColor: colors.blue,
        marginTop: 5,
        width: 80,
        borderRadius: 5,
    },
    containerStyle: {
        justifyContent: "center",
        flex: 0.25,
        alignItems: "center",
    },
    buttonText: {
        color: colors.black,
        flex: 1,
    },
});

export default PlanItem;