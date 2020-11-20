import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Entypo } from '@expo/vector-icons';


const Header = ({ onPress }) => { //pull out onPress and title properties from prop

    return (
        <TouchableOpacity onPress={onPress}>
            <Entypo name="chat" size={30} color="#003f5c" />
        </TouchableOpacity>
    );
};

export default Header;