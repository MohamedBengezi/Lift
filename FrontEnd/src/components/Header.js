import React, { useReducer, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Context as AuthContext } from '../context/AuthContext';
import colors from '../hooks/colors';
import { navigate } from '../navigationRef';


const Header = ({ isFeedback, showComments, isUsersPost, name, uid, timeSubmitted, renderAnsweredText, renderArchiveButton }) => {
    const { state } = useContext(AuthContext);
    return (
        <TouchableOpacity
            style={showComments ? styles.postDetailsHeader : styles.postHeader}
            onPress={() => {
                if (isUsersPost) navigate('Profile')
                else navigate('ViewProfile', { isHeaderShow: true, username: name, uid: uid })
            }}
        >
            <View
                style={styles.displayImageContainer}
            >
                <Image
                    style={styles.avatar}
                    source={{
                        uri: (isUsersPost && state.profilePicture) ? state.profilePicture : "https://reactnative.dev/img/tiny_logo.png",
                    }}
                />
            </View>

            <View style={styles.nameAndImageContainer}>
                <TouchableOpacity
                    style={styles.avatarName}
                    onPress={() => navigate('ViewProfile', { isHeaderShow: true, username: name })}
                    activeOpacity={0.8}
                >
                    <Text style={{ fontSize: 17 }}>{name}</Text>
                    <View style={styles.postDate}>
                        <Text style={{ fontSize: 11, color: colors.reallyDarkGrey }}>
                            {timeSubmitted}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                {isFeedback ? renderAnsweredText() : null}
                {isUsersPost ? renderArchiveButton() : null}
            </View>


        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    postDetailsHeader: {
        height: 70,
        flexDirection: "row",
        marginBottom: -80,
        justifyContent: "center",
        alignItems: "center"

    },
    postHeader: {
        height: 70,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    displayImageContainer: {
        flex: 2,
        alignItems: "center",
        justifyContent: "center",
    },
    nameAndImageContainer: {
        flex: 9,
    },
    avatar: {
        height: 50,
        width: 50,
        borderRadius: 25,
        marginLeft: 10,
    },
    avatarName: {
        flex: 2,
        justifyContent: "center",
        marginLeft: 10
    },
    postDate: {
        justifyContent: "center",
    },

});

export default Header;