import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';


const HeaderLeft = ({ onPress }) => { //pull out onPress and title properties from prop

    return (
        <TouchableOpacity onPress={onPress}>
            <MaterialIcons name="account-circle" size={30} color="#003f5c" />
        </TouchableOpacity>
    );
};


export default HeaderLeft;