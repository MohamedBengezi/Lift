import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Context } from '../components/context/CreateContext';
import CardComponent from '../components/common/CardComponent';
import { ScrollView } from 'react-native-gesture-handler';

const HomeScreen = ({ route, navigation }) => {
    let image;
    if (route.params == undefined || route.params.image == undefined) {
        image = Image.resolveAssetSource(require("../../assets/icon.png"));
    } else {
        image = route.params.image;
    }

    const onPress = () => {
        navigation.navigate('Profile', { name: navigation.getParam('image') })
    };

    return (
        <View style={styles.background}>
            <ScrollView>
            </ScrollView>
        </View >
    );
};


const styles = StyleSheet.create({
    background: {
        backgroundColor: '#ffffff',
        flex: 1,
        flexDirection: 'column',
        justifyContent: "flex-start"
    },
    row: {
        height: 100,
        flexDirection: "row",
        justifyContent: "flex-start",
        paddingVertical: 20,
        alignItems: "center",

    },
    col: {
        flexDirection: "column"
    },
    title: {
        fontSize: 15,
        paddingLeft: 10,
        textAlign: "left",
        fontWeight: "bold",
        color: '#003f5c',
        marginTop: 15
    },
    icon: {
        fontSize: 27,
        paddingRight: 10
    },
    chatIcon: {
        width: 70,
        height: 70,
        marginLeft: 14,
        borderWidth: 1
    },
    chatName: {
        fontSize: 18,
        paddingLeft: 10,
        fontWeight: "bold",
        color: '#000000'
    },
    lastSent: {
        paddingLeft: 10,
        color: '#808080'
    },
    lastSentTime: {
        color: '#808080',
        alignSelf: "flex-end",
        flex: 1,
        margin: 10
    }
});
export default HomeScreen;