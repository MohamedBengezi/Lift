import React, { useReducer } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../hooks/colors';
import Ionicons from "react-native-vector-icons/Ionicons";

const STAR_SIZE = 45;
const PlanItem = ({ title, author, navigation }) => {
    return (
        <TouchableOpacity style={styles.container} onPress={() => navigation.navigate('ViewPlan', { author, title })}>
            <View style={styles.textContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.author}>{author}</Text>
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
    }
});

export default PlanItem;