import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Platform,
    StatusBar
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { navigate } from "../navigationRef";


const PostDetails = ({ media, title }) => {
    const [likesAndComments, setLikesAndComments] = useState({ commented: false, liked: false });
    console.log("YYY", media, title)

    const onPress = () => {
        console.log("postdetails: liked or commented!")
    }

    function LikeAndComment(media) {
        const { liked, commented } = likesAndComments;
        console.log("YYY1", media)

        return (
            <View style={styles.postActionView}>
                <TouchableOpacity style={styles.icons}>
                    <Ionicons
                        name={commented ? "md-heart" : "md-heart-empty"}
                        color={commented ? 'black' : null} type="ionicon" size={25}
                        onPress={() => onPress()}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.icons}>
                    <Ionicons
                        name={commented ? "md-chatbubbles" : "md-chatboxes"}
                        color={commented ? 'black' : null} type="ionicon" size={25}
                        onPress={() => onPress()}
                    />
                </TouchableOpacity>
                {/* <Text style={styles.postActionText}>{!!item.likes && item.likes.length || 0}</Text> */}
            </View>
        );
    }

    return (
        <View style={styles.postContainer}>
            <View style={styles.postHeader}>
                <TouchableOpacity style={styles.displayImageContainer} onPress={() => console.log('Profile Image pressed')} activeOpacity={0.8}>
                    <Image style={styles.avatar}
                        source={{
                            uri: 'https://reactnative.dev/img/tiny_logo.png',
                        }} />
                </TouchableOpacity>

                <View style={styles.nameAndImageContainer} >
                    <TouchableOpacity style={styles.avatarName} onPress={() => console.log('Profile pressed')} activeOpacity={0.8} >
                        <Text style={{ fontSize: 17 }}>
                            John Doe
              </Text>
                    </TouchableOpacity>
                    <View style={styles.location} >
                        <Text style={{ color: 'black', fontSize: 12, fontStyle: 'italic' }}>
                            location
              </Text>
                    </View>
                </View>
            </View>
            <View style={styles.postImageCaptionContainer} >
                <TouchableOpacity onPress={() => console.log('Post pressed')} activeOpacity={1}>
                    {media}
                </TouchableOpacity>
                <Text>
                    {title}
                </Text>
            </View>

            <View style={styles.postLogs} >
                <View style={styles.postDate} >
                    <Text style={{ fontSize: 11, color: '#4C4B4B' }}>5 mins ago </Text>
                </View>
                <LikeAndComment media={media} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    icons: {
        flex: 1,
        flexDirection: 'row',
        fontSize: 200,
        alignItems: 'flex-start'
    },
    mainContent: {
        flex: 1,
        justifyContent: 'center',
        marginTop: 50,
        marginBottom: 50,
    },
    postContainer: {
        borderBottomWidth: 1,
        borderColor: '#aaaaaa',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',

    },
    postHeader: {
        height: 70,
        flexDirection: 'row',
        backgroundColor: '#ffffff'

    },
    postImageCaptionContainer: {
        backgroundColor: '#ffffff',
        alignItems: 'center',
        height: "50%",
        width: "80%"
    },
    postLogs: {
        height: 50,
        flexDirection: 'row',
        backgroundColor: '#ffffff'

    },
    displayImageContainer: {
        flex: 2,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',

    },
    nameAndImageContainer: {
        flex: 9,
    },
    avatar: {
        height: 50,
        width: 50,
        borderRadius: 25,
        marginLeft: 10
    },
    avatarName: {
        flex: 2,
        backgroundColor: 'white',
        justifyContent: 'center',
        marginLeft: 5
    },
    location: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
        marginLeft: 5
    },
    postImage: {
        width: '100%',
        height: 250,
    },
    postDate: {
        flex: 3,
        backgroundColor: 'white',
        justifyContent: 'center',
        marginLeft: 20,
    },
    postActionView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff'

    },
    postActionText: {
        marginLeft: 10,
        color: '#44484B',
        fontSize: 15,
        fontFamily: 'Comfortaa'
    },

});

export default PostDetails;