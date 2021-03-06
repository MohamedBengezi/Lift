import React, { useReducer, useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../hooks/colors';
import Ionicons from "react-native-vector-icons/Ionicons";
import { Button } from 'react-native-elements'
import { Context as AuthContext } from "../context/AuthContext";

const STAR_SIZE = 45;
const PlanItem = (props) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const [planID, setPlanID] = useState("eewrgrg");
    let { title, author, navigation } = props
    let parentRoute = navigation.state.routeName;
    let mainScreen = 'Main'
    const { state, unfollowWorkoutPlan, followWorkoutPlan } = useContext(AuthContext);

    return (
        <TouchableOpacity
            style={parentRoute != mainScreen ? styles.viewPlanContainer : styles.container}
            onPress={() => navigation.navigate('ViewPlan', { author, title })}
        >
            <View style={styles.textContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.author}>{author}</Text>
                {parentRoute != mainScreen ?
                    <Button
                        title={!isFollowing ? "Follow" : "Unfollow"}
                        onPress={() => {
                            console.log('followed plan');
                            !isFollowing ? followWorkoutPlan({ planID: planID }) : unfollowWorkoutPlan({ planID: planID })
                            setIsFollowing(!isFollowing)
                        }}
                        buttonStyle={styles.button}
                        titleStyle={styles.buttonText}
                    />
                    : null
                }
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
        height: "22%",
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