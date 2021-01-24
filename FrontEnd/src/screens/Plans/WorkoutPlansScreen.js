import React, { useReducer, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import SearchBar from '../../components/SearchBar';
import DropDownPicker from 'react-native-dropdown-picker';
import colors from '../../hooks/colors';
import PlanList from '../../components/PlanList'

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


const WorkoutPlansScreen = ({ navigation }) => {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('');

    const onSwipeDown = (gestureState) => {
        console.log('swiped down');
        navigation.navigate('Main');
    }
    const searchDatabase = () => {
        console.log('Searched')
    }

    return (
        <GestureRecognizer
            onSwipeDown={() => onSwipeDown()}
            style={{ flex: 1 }}
        >
            <View>
                <SearchBar
                    term={search}
                    onTermChange={setSearch}
                    onTermSubmit={searchDatabase}
                    style={styles.searchBar}
                />

                <DropDownPicker
                    items={[
                        { label: 'Highest Rated', value: 'rating', hidden: true },
                        { label: 'Relevance', value: 'relevance' },
                        { label: 'Most Popular', value: 'popular' },
                    ]}
                    defaultValue={filter}
                    containerStyle={{ height: 40, width: 160, alignSelf: 'flex-end', marginRight: 10 }}
                    style={{ backgroundColor: colors.lightGrey }}
                    itemStyle={{
                        justifyContent: 'flex-start', color: colors.black
                    }}
                    labelStyle={{ color: colors.black }}
                    dropDownStyle={{ backgroundColor: '#fafafa' }}
                    onChangeItem={item => setFilter(item.value)}
                />

                <PlanList navigation={navigation} />
            </View>
        </GestureRecognizer>
    );
};

const styles = StyleSheet.create({
    searchBar: {
    },
    picker: {
        marginRight: 20,
        borderWidth: 2
    },
    plans: {
        margin: 20
    }
});

export default WorkoutPlansScreen;