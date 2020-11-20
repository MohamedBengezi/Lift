import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';


const HeaderLeft = ({ onPress }) => { //pull out onPress and title properties from prop

    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text>Back</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default HeaderLeft;