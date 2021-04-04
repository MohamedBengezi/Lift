import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { navigate } from "../navigationRef";
import colors from '../hooks/colors';
import { Video } from "expo-av";


const Comment = ({ comment, index, isFeedback }) => { //pull out onPress and title properties from prop
    const [liked, setLiked] = useState(false);
    let profile_image = "https://reactnative.dev/img/tiny_logo.png";
    let username = comment.username;
    let cmt = comment.comment;
    let isImage = (typeof comment.isImage !== 'undefined') ? comment.isImage : true;
    let mediaPath = (comment.mediaPath) ? comment.mediaPath : "https://www.mensjournal.com/wp-content/uploads/2018/02/squats-mens-journal-february-2018.jpg";

    const onPressLike = () => {
        setLiked(!liked);
    }

    function renderMedia() {
        if (!isFeedback) return null;
        if (isImage) {
            return <Image source={{ uri: mediaPath }} style={styles.image} />
        } else {
            return (<Video
                source={{
                    uri: mediaPath,
                }}
                rate={1.0}
                volume={1.0}
                isMuted={true}
                resizeMode="contain"
                shouldPlay
                isLooping
                style={styles.video}
            />);
        }
    }

    return (
        <View style={{ ...styles.container, height: isFeedback ? 300 : "70%" }}>
            <View style={styles.commentContainer} key={index}>
                <TouchableOpacity activeOpacity={0.8}
                    onPress={() => navigate('ViewProfile', { isHeaderShow: true, username: username })}>
                    <Image source={{ uri: profile_image || '' }} style={styles.commentAvatar} />
                </TouchableOpacity>
                <View>
                    <TouchableOpacity
                        onPress={() => navigate('ViewProfile', { isHeaderShow: true, username: username })}>
                        <Text style={styles.commentUsernameLabel}>{username}</Text>
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.commentContentLabel}>{cmt}</Text>
                    </View>
                </View>
                <View style={styles.like}>
                    <Ionicons
                        name={liked ? "md-heart" : "md-heart-empty"}
                        color={liked ? colors.red : null} size={25}
                        onPress={() => onPressLike()}
                    />
                </View>
            </View>
            {renderMedia()}


        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 0.5,
        borderColor: colors.darkGrey,
        flexDirection: 'column',
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
    },
    video: {
        flex: 1,
        margin: 10
    }

});

export default Comment;