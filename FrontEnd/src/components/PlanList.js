import React, { useContext, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import PlanItem from './PlanItem';
import { Context as AuthContext } from "../context/AuthContext";
import { FlatList } from 'react-native-gesture-handler';

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

const STAR_SIZE = 45;
const PlanList = ({ navigation }) => {
    const { state } = useContext(AuthContext);
    const [plans, setPlans] = useState(state.plans);
    let count = 0;
    if (state.plans != plans) setPlans(state.plans)
    console.log('planlist ', plans);

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