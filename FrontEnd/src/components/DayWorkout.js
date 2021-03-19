import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../hooks/colors';
import { Table, Row, Rows } from 'react-native-table-component';

const DayWorkout = ({ weekday, program }) => {
    const [tableHead, setTableHead] = useState(['Workout', 'Length', 'Reps']);
    return (
        <View style={styles.plans}>
            <Text style={styles.weekday}>{weekday}</Text>
            <View style={styles.container}>
                <Table style={styles.tableStyle} borderStyle={{ borderWidth: 2 }}>
                    <Row data={tableHead} style={styles.head} textStyle={styles.headerText} />
                    <Rows data={program} textStyle={styles.text} />
                </Table>
            </View>
        </View>


    );
};

const styles = StyleSheet.create({
    plans: {
        backgroundColor: colors.lighterGrey,
        borderRadius: 20,
        width: 300,
        flex: 1,
        marginBottom: 20
    },
    tableStyle: {
        borderColor: 'transparent'
    },
    container: {
        padding: 16,
        paddingTop: 0,
    },
    head: {
        height: 40,
    },
    headerText: { margin: 6, fontWeight: 'bold' },
    text: { margin: 6, },
    weekday: {
        padding: 16,
        fontSize: 20,
        fontWeight: 'bold'
    }
});

export default DayWorkout;