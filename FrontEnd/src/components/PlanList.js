import React from 'react';
import { View, StyleSheet } from 'react-native';
import PlanItem from './PlanItem';
import { FlatList } from 'react-native-gesture-handler';

const STAR_SIZE = 45;
const PlanList = ({ navigation, plans }) => {
    let count = 0;

    function renderPlanItem(item) {
        if (!item || !item.item) return
        return (
            <PlanItem plan={item.item} navigation={navigation} key={item.index} />
        );
    }

    return (

        <View style={styles.plans}>
            {(plans) ?
                <FlatList
                    data={plans}
                    renderItem={(item) => renderPlanItem(item)}
                    keyExtractor={(item) => item.id + " " + count++}
                    contentContainerStyle={{ paddingBottom: "100%" }}
                /> : null

            }

        </View>
    );
};

const styles = StyleSheet.create({
    plans: {
        margin: 20
    }
});

export default PlanList;