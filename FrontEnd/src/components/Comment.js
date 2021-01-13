import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Image, } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Ionicons from "react-native-vector-icons/Ionicons";
import { navigate } from "../navigationRef";
import colors from '../hooks/colors';


const Comment = ({ comment, index }) => { //pull out onPress and title properties from prop
    const [liked, setLiked] = useState(false);

    const onPressLike = () => {
        setLiked(!liked);
    }

    return (
        <View style={styles.commentContainer} key={index}>
            <TouchableOpacity activeOpacity={0.8}
                onPress={() => navigate('Profile', { isHeaderShow: true, userId: comment.user.id })}>
                <Image source={{ uri: comment.user.profile_image || '' }} style={styles.commentAvatar} />
            </TouchableOpacity>
            <View style={styles.postUsernameLocationContainer}>
                <TouchableOpacity style={styles.postUsernameView}
                    onPress={() => navigate('Profile', { isHeaderShow: true, userId: comment.user.id })}>
                    <Text style={styles.commentUsernameLabel}>{comment.user.name}</Text>
                </TouchableOpacity>
                <View style={styles.postLocationView}>
                    <Text style={styles.commentContentLabel}>{comment.description}</Text>
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
    );
};

const styles = StyleSheet.create({
    sectionHeaderText: {
        fontSize: 13,
        color: colors.darkGrey,
        marginVertical: 10,
        marginLeft: 10
    },
    commentContainer: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderColor: colors.grey,
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
        flexDirection: 'column',
        marginLeft: 150
    }
});

export default Comment;