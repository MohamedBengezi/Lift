import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Ionicons from "react-native-vector-icons/Ionicons";
import { navigate } from "../navigationRef";
import colors from '../hooks/colors';


const Comment = ({ comment, index, isFeedback }) => { //pull out onPress and title properties from prop
    const [liked, setLiked] = useState(false);
    console.log('ddd', comment)
    let profile_image = "https://reactnative.dev/img/tiny_logo.png";
    let username = comment.username;
    let mediaPath = Image.resolveAssetSource(require("../../assets/icon.png")).uri;
    let cmt = comment.comment;

    const onPressLike = () => {
        setLiked(!liked);
    }

    console.log('comment', mediaPath)

    return (
        <View style={styles.container}>
            <View style={styles.commentContainer} key={index}>
                <TouchableOpacity activeOpacity={0.8}
                    onPress={() => navigate('Profile', { isHeaderShow: true, username: username })}>
                    <Image source={{ uri: profile_image || '' }} style={styles.commentAvatar} />
                </TouchableOpacity>
                <View style={styles.postUsernameLocationContainer}>
                    <TouchableOpacity style={styles.postUsernameView}
                        onPress={() => navigate('Profile', { isHeaderShow: true, userId: comment.user.id })}>
                        <Text style={styles.commentUsernameLabel}>{username}</Text>
                    </TouchableOpacity>
                    <View style={styles.postLocationView}>
                        <Text style={styles.commentContentLabel}>{cmt}</Text>
                    </View>
                </View>
                <View style={styles.like}>
                    <Ionicons
                        name={liked ? "md-heart" : "md-heart-empty"}
                        color={liked ? colors.red : null} type="ionicon" size={25}
                        onPress={() => onPressLike()}
                    />
                </View>
            </View>
            {isFeedback ? <Image source={{ uri: mediaPath }} style={styles.image} /> : null}

        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 0.5,
        borderColor: colors.darkGrey,
        flexDirection: 'column',
        height: 300
    },
    commentContainer: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    commentAvatar: {
        height: 25,
        width: 25,
        borderRadius: 13.5,
        marginLeft: 10
    },
    commentUsernameLabel: {
        fontSize: 14,
        color: colors.reallyDarkGrey,
        marginLeft: 10,
    },
    commentContentLabel: {
        fontSize: 15,
        color: colors.darkerGrey,
        marginLeft: 10,
    },
    commentsContainer: {
        backgroundColor: colors.grey
    },
    like: {
        position: 'absolute',
        right: 15,
        flexDirection: 'column',
    },
    image: {
        flex: 1,
        resizeMode: 'contain',
        marginBottom: 10,
        marginTop: 10
    }

});

export default Comment;