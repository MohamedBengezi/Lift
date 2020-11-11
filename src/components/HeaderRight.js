import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const HeaderRight = ({ onPress }) => { //pull out onPress and title properties from prop

    return (
        <TouchableOpacity onPress={onPress}>
            <AntDesign name="plus" size={30} color="#003f5c" />
        </TouchableOpacity>
    );
};


export default HeaderRight;