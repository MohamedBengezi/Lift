import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import colors from "../../hooks/colors";
import DropDownPicker from 'react-native-dropdown-picker';
import Spacer from "../../components/Spacer";
import { navigate } from "../../navigationRef";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { StatusBar } from "react-native";

const AddPlanScreen = ({ navigation }) => {
    let day = {
        exercises: [],
        dayoftheweek: "Monday",
        week_number: 1
    }
    let plan = navigation.getParam('plan');
    day = (navigation.getParam('day')) ? navigation.getParam('day') : day;

    var count = 0;

    var items = [];
    for (var i = 1; i <= 30; i++) {
        items.push({ label: i.toString(), value: i, hidden: false });
    }

    function renderWorkouts(workout) {
        let workoutInfo = workout.item.split(',')
        return (
            <View style={styles.workout} key={workout.index}>
                <Text>{workoutInfo[0]}</Text>
                <Text>{workoutInfo[2] + " " + workoutInfo[3]}</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={{ flex: 1, alignItems: "center", flexDirection: "column", marginTop: StatusBar.currentHeight + 25 }}>
            <Spacer />
            <View style={styles.labelAndDropView}>
                <Text style={styles.label}>Day:  </Text>
                <DropDownPicker
                    items={[
                        { label: 'Monday', value: 'Monday', hidden: true },
                        { label: 'Tuesday', value: 'Tuesday' },
                        { label: 'Wednesday', value: 'Wednesday' },
                        { label: 'Thursday', value: 'Thursday' },
                        { label: 'Friday', value: 'Friday' },
                        { label: 'Saturday', value: 'Saturday' },
                        { label: 'Sunday', value: 'Sunday' }
                    ]}
                    defaultValue={'Monday'}
                    style={{ width: 100, borderWidth: 1 }}
                    itemStyle={{
                        justifyContent: 'flex-start'
                    }}
                    labelStyle={{ color: colors.black }}
                    onChangeItem={item => day.dayoftheweek = item.value}
                />
            </View>

            <View style={styles.labelAndDropView}>
                <Text style={styles.label}>Week:  </Text>
                <DropDownPicker
                    items={items}
                    defaultValue={1}
                    style={{ width: 100, borderWidth: 1 }}
                    itemStyle={{
                        justifyContent: 'flex-start'
                    }}
                    labelStyle={{ color: colors.black }}
                    onChangeItem={item => day.week_number = item.value}
                />
            </View>


            <Button
                title="SAVE PLAN"
                onPress={() => {
                    plan.days.push(day);
                    navigate('CreatePlan', { plan: plan })
                }}
                buttonStyle={styles.create}
                titleStyle={styles.buttonText}
                containerStyle={styles.containerStyle}
            />
            <FlatList
                data={day.exercises}
                renderItem={(item) => renderWorkouts(item)}
                keyExtractor={(item) => " " + count++}
            />

            <Button
                title="ADD WORKOUT"
                onPress={() => {
                    navigate('AddWorkout', { day: day, plan: plan });
                }}
                buttonStyle={styles.button}
                titleStyle={styles.buttonText}
                containerStyle={styles.addPlanStyle}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    create: {
        backgroundColor: colors.blue,
        width: "70%",
        borderRadius: 5,
    },
    button: {
        backgroundColor: colors.darkGrey,
        width: "80%",
        borderRadius: 5,
    },
    containerStyle: {
        position: 'absolute',
        top: 5,
        right: 5,
        alignItems: "center",
        flex: 0.15,
    },
    addPlanStyle: {
        position: 'absolute',
        bottom: 40,
        paddingTop: "5%",
        alignItems: "center",
        flex: 0.15,
    },
    buttonText: {
        color: colors.black,
        flex: 1,
        fontSize: 15,
    },
    labelAndDropView: {
        flexDirection: "row",
        flex: 0.1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: "10%",
        width: "100%"
    },
    label: {
        fontSize: 20,
        textDecorationColor: colors.black,
        fontWeight: "bold"
    },
    workout: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: "center",
        borderRadius: 5,
        backgroundColor: colors.lightGrey,
        padding: 20,
        margin: 20,
        width: "65%"
    }
});

export default AddPlanScreen;
