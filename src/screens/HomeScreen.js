import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Context } from '../components/context/CreateContext';
import CardComponent from '../components/common/CardComponent';
import { ScrollView } from 'react-native-gesture-handler';
import { Video } from "expo-av";
import { Item } from 'native-base';

const HomeScreen = ({ route, navigation }) => {
    let image = null, video = null, count = 0;

    if (route.params == undefined) {
        image = Image.resolveAssetSource(require("../../assets/icon.png"));
    } else if (route.params.video) {
        video = [route.params.video, route.params.video, route.params.video, route.params.video];
    } else {
        image = [route.params.image, route.params.image, route.params.image, route.params.image];
    }

    const onPress = () => {
        navigation.navigate('Profile', { name: navigation.getParam('image') })
    };

    const renderVid = (vid) =>
        <View style={styles.container}>
            <Text>this is a post</Text>
            <Video
                source={{
                    uri: vid.item.uri,
                }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="cover"
                shouldPlay
                isLooping
                style={styles.post}
            />
        </View>

    const renderImage = (image) =>
        <View style={styles.container}>
            <Text>this is a post</Text>
            <Image
                source={{ uri: image.item.uri }}
                style={styles.post}
            />
        </View>


    if (video) {
        return (
            <View style={styles.background}>
                <ScrollView>
                    <FlatList
                        data={video}
                        renderItem={vid => renderVid(vid)}
                        keyExtractor={vid => vid.uri + count++}
                    />
                </ScrollView>
            </View >
        );
    } else {
        return (
            <View style={styles.background}>
                <ScrollView>
                    <FlatList
                        data={image}
                        renderItem={photo => renderImage(photo)}
                        keyExtractor={photo => photo.uri + count++}
                    />

                </ScrollView>
            </View >
        );
    }
};


const styles = StyleSheet.create({
    background: {
        backgroundColor: '#ffffff',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    container: {
        alignItems: 'center',
        marginTop: 20,
        borderRadius: 1,
        borderWidth: 2,
        borderColor: 'black',

    },
    post: {
        alignSelf: 'center',
        height: 300,
        width: 300,
        resizeMode: 'cover',
        justifyContent: "space-between"

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