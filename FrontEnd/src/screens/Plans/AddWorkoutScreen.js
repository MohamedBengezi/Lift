import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { Button } from "react-native-elements";
import colors from "../../hooks/colors";
import DropDownPicker from 'react-native-dropdown-picker';
import Spacer from "../../components/Spacer";
import { navigate } from "../../navigationRef";
import { StatusBar } from "react-native";

const AddWorkoutScreen = ({ navigation }) => {
    const [workout, setWorkout] = useState({
        name: "",
        duration_type: "mins",
        duration: "1 hours",
        subduration: "1 mins "
    });

    let plan = navigation.getParam('plan');
    let day = navigation.getParam('day');
    let exercises = day.exercises;

    var items = [];

    for (var i = 0; i <= 30; i++) {
        items.push({ label: i.toString(), value: i, hidden: false });
    }

    function renderSetsDropdown() {
        return (
            <View style={{
                flexDirection: "column",
                flex: 0.20,
                justifyContent: "center",
                alignItems: "center",
            }}>
                <View style={styles.labelAndDropView}>
                    <Text style={styles.label}>Sets:  </Text>
                    <DropDownPicker
                        items={items}
                        defaultValue={1}
                        style={{ width: 100, borderWidth: 1 }}
                        itemStyle={{
                            justifyContent: 'flex-start'
                        }}
                        labelStyle={{ color: colors.black, textAlign: 'center' }}
                        onChangeItem={item => setWorkout({ ...workout, duration: item.value + ' sets ' })}
                    />
                </View>
                <Spacer />
                <View style={styles.labelAndDropView}>
                    <Text style={styles.label}>Reps:  </Text>
                    <DropDownPicker
                        items={items.slice(0, 15)}
                        defaultValue={1}
                        style={{ width: 100, borderWidth: 1 }}
                        itemStyle={{
                            justifyContent: 'flex-start'
                        }}
                        labelStyle={{ color: colors.black, textAlign: 'center' }}
                        onChangeItem={item => setWorkout({ ...workout, subduration: item.value + " reps" })}
                    />
                </View>

            </View>
        );
    }

    function renderMinsDropdown() {
        return (
            <View style={{
                flexDirection: "column",
                flex: 0.20,
                justifyContent: "center",
                alignItems: "center",
            }}>
                <View style={styles.labelAndDropView}>
                    <Text style={styles.label}>Hour(s):  </Text>
                    <DropDownPicker
                        items={items}
                        defaultValue={1}
                        style={{ width: 100, borderWidth: 1 }}
                        itemStyle={{
                            justifyContent: 'flex-start'
                        }}
                        labelStyle={{ color: colors.black, textAlign: 'center' }}
                        onChangeItem={item => setWorkout({ ...workout, duration: item.value + ' hour(s) ' })}
                    />
                </View>
                <Spacer />
                <View style={styles.labelAndDropView}>
                    <Text style={styles.label}>Min(s):  </Text>
                    <DropDownPicker
                        items={items}
                        defaultValue={1}
                        style={{ width: 100, borderWidth: 1 }}
                        itemStyle={{
                            justifyContent: 'flex-start'
                        }}
                        labelStyle={{ color: colors.black, textAlign: 'center' }}
                        onChangeItem={item => setWorkout({ ...workout, subduration: item.value + " mins" })}
                    />
                </View>

            </View>
        );
    }
    return (
        <View style={{ flex: 1, alignItems: "center", flexDirection: "column", marginTop: StatusBar.currentHeight + 25 }}>
            <Spacer />
            <TextInput
                style={styles.titleInput}
                value={workout.name}
                onChangeText={(text) => setWorkout({ ...workout, name: text })}
                placeholder="Workout Name"
            />

            <View style={styles.labelAndDropView2}>
                <Text style={styles.label}>Duration Type:  </Text>
                <DropDownPicker
                    items={[
                        { label: 'sets', value: 'sets', hidden: true },
                        { label: 'mins', value: 'mins' }
                    ]}
                    defaultValue={workout.duration_type}
                    style={{ width: 100, borderWidth: 1 }}
                    itemStyle={{
                        justifyContent: 'flex-start'
                    }}
                    labelStyle={{ color: colors.black }}
                    onChangeItem={item => setWorkout({ ...workout, duration_type: item.value })}
                />
            </View>
            <Spacer />
            <Text style={styles.duration}>Duration: </Text>
            <View style={styles.labelAndDropView}>
                {workout.duration_type == 'sets' ? renderSetsDropdown() : renderMinsDropdown()}
            </View>

            <Button
                title="SAVE WORKOUT"
                onPress={() => {
                    let exercise = workout.name + "," + workout.duration_type + "," + workout.duration + "," + workout.subduration
                    exercises.push(exercise)
                    day.exercises = exercises
                    navigate('AddPlan', { day: day, plan: plan });
                }}
                buttonStyle={styles.create}
                titleStyle={styles.buttonText}
                containerStyle={styles.containerStyle}
            />

        </View>
    );
};

const styles = StyleSheet.create({
    titleInput: {
        borderBottomWidth: 1,
        width: "80%",
        fontSize: 15,
        marginVertical: "5%",
    },
    preview: {
        alignItems: "center",
        height: "100%",
        width: 250,
        resizeMode: "cover",
    },
    create: {
        backgroundColor: colors.blue,
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
        paddingTop: "15%",
        alignItems: "center",
        flex: 0.15,
    },
    buttonText: {
        color: colors.black,
        flex: 1,
        fontSize: 15,
    },
    labelAndDropView: {
        justifyContent: "center",
        alignItems: "center",
    },
    labelAndDropView2: {
        flexDirection: "row",
        flex: 0.10,
        justifyContent: "center",
        alignItems: "center",
    },
    label: {
        fontSize: 20,
        textDecorationColor: colors.black,
    },
    duration: {
        fontSize: 20,
        textDecorationColor: colors.black,
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        marginLeft: '10%',
        marginTop: "10%"
    },
});

export default AddWorkoutScreen;
