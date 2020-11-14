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
                <CardComponent thumbnail={require("../../assets/icon.png")} youtube={true} id_youtube="L-W_EDUQw6I" likes="11" nb_commentaires="202" pseudo="maxgfr" date="01/01/2018" description="blablablabla" post={image} />
                <CardComponent thumbnail={require("../../assets/icon.png")} youtube={true} id_youtube="507d9xto6Og" likes="11" nb_commentaires="202" pseudo="maxgfr" date="01/01/2018" description="blablablabla" post={image} />
                <CardComponent thumbnail={require("../../assets/icon.png")} twitch_live={true} chaine_twitch="humilityfr" likes="11" nb_commentaires="202" pseudo="maxgfr" date="01/01/2018" description="blablablabla" post={image} />
                <CardComponent thumbnail={require("../../assets/icon.png")} twitch_videos={true} id_twitch_video="329825601" likes="11" nb_commentaires="202" pseudo="maxgfr" date="01/01/2018" description="blablablabla" post={image} />
                <CardComponent thumbnail={require("../../assets/icon.png")} twitch_clips={true} id_twitch_clip="LongDrabPelicanCurseLit" likes="11" nb_commentaires="202" pseudo="maxgfr" date="01/01/2018" description="blablablabla" />
                <CardComponent thumbnail={require("../../assets/icon.png")} twitch_collections={true} id_twitch_video="329031576" id_twitch_collection="y9LXlzpDYhU6yw" likes="11" nb_commentaires="202" pseudo="maxgfr" date="01/01/2018" description="blablablabla" post={image} />
                <CardComponent thumbnail={require("../../assets/icon.png")} instagram={true} id_instagram_post="Bpmrcm7HgQW" likes="11" nb_commentaires="202" pseudo="maxgfr" date="01/01/2018" description="blablablabla" post={image} />
                <CardComponent thumbnail={require("../../assets/icon.png")} spotify_album={true} id_spotify="1zNr37qd3iZJ899byrTkcj" likes="11" nb_commentaires="202" pseudo="maxgfr" date="01/01/2018" description="blablablabla" post={image} />
                <CardComponent thumbnail={require("../../assets/icon.png")} spotify_playlist={true} id_user="2c8a6esgmr19imm8bl14570vk" id_spotify="2280Pf3U69Rp6CdVpxzSNr" likes="11" nb_commentaires="202" pseudo="maxgfr" date="01/01/2018" description="blablablabla" post={image} />
                <CardComponent thumbnail={require("../../assets/icon.png")} spotify_song={true} id_spotify="4GXl8l1MfZPf2GvpyRPJBf" likes="11" nb_commentaires="202" pseudo="maxgfr" date="01/01/2018" description="blablablabla" post={image} />
                <CardComponent thumbnail={require("../../assets/icon.png")} pinterest={true} id_pinterest="801781539887841710" likes="11" nb_commentaires="202" pseudo="maxgfr" date="01/01/2018" description="blablablabla" post={image} />
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