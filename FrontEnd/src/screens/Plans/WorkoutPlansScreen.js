import React, { useReducer, useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, RefreshControl } from 'react-native';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import SearchBar from '../../components/SearchBar';
import DropDownPicker from 'react-native-dropdown-picker';
import colors from '../../hooks/colors';
import PlanList from '../../components/PlanList'
import Ionicons from "react-native-vector-icons/Ionicons";
import { navigate } from '../../navigationRef';
import { Context as AuthContext } from "../../context/AuthContext";
import { SafeAreaView } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Directions, FlingGestureHandler, State } from 'react-native-gesture-handler';


const WorkoutPlansScreen = ({ navigation }) => {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('');
    const { state, searchWorkoutPlans } = useContext(AuthContext);
    const [plans, setPlans] = useState(state.plans);
    if (state.plans != plans) setPlans(state.plans)

    useEffect(() => {
        console.log('getting plans')
        if (!state.plans) searchDatabase({ query: "" })
    }, [navigation])

    const onSwipeDown = (gestureState) => {
        navigation.navigate('Main');
    }
    const searchDatabase = () => {
        console.log('Searched');
        searchWorkoutPlans({ query: search })
    }

    return (
        <SafeAreaView style={styles.background}>
            <ScrollView
            >
                <FlingGestureHandler
                    direction={Directions.DOWN}
                    onHandlerStateChange={({ nativeEvent }) => {
                        if (nativeEvent.state === State.ACTIVE) {
                            onSwipeDown()
                        }
                    }}>
                    <View>
                        <SearchBar
                            term={search}
                            onTermChange={setSearch}
                            onTermSubmit={searchDatabase}
                            style={styles.searchBar}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Ionicons
                                name="md-add-circle"
                                color={colors.blue}
                                type="ionicon"
                                size={35}
                                style={{ marginLeft: '5%', marginTop: '1%' }}
                                onPress={() => navigate('CreatePlan')}
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
                        </View>
                        <PlanList navigation={navigation} plans={plans} />
                    </View>
                </FlingGestureHandler>
            </ScrollView>
        </SafeAreaView>
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