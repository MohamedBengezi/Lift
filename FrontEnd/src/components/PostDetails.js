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
import Comment from './Comment';

const PostDetails = ({ media, title, showComments }) => {
    const [likedOrCommented, setLikedOrCommented] = useState({ commented: false, liked: false });
    const [likesAndComments, setLikesAndComments] = useState({ likes: 0, comments: 0 })
    let comment = {
        "user": {
            "id": 123,
            "username": "johndoe",
            "name": "John Doe",
            "profile_image": "https://reactnative.dev/img/tiny_logo.png"
        },
        "description": "This is a sick photo man!"
    }

    console.log("YYY", media, title)

    const onPressLike = () => {
        console.log("postdetails: liked or commented!")
        let liked = !likedOrCommented.liked
        let likes = likesAndComments.likes
        if (!liked) {
            setLikesAndComments({ ...likesAndComments, likes: likes - 1 });
        } else {
            setLikesAndComments({ ...likesAndComments, likes: likes + 1 });
        }
        setLikedOrCommented({ liked: liked });
    }

    const onPressComment = () => {
        console.log("postdetails: liked or commented!")
        setLikedOrCommented({ commented: !likedOrCommented.commented });
    }


    function LikeAndComment(media) {
        const { liked, commented } = likedOrCommented;
        const { likes, comments } = likesAndComments;
        console.log("YYY1", media)
        return (
            <View style={styles.postActionView}>
                <TouchableOpacity style={styles.icons}>
                    <Ionicons
                        name={liked ? "md-heart" : "md-heart-empty"}
                        color={liked ? '#ff1616' : null} type="ionicon" size={25}
                        onPress={() => onPressLike()}
                    />
                    <Text style={styles.postActionText}>{/*!!item.likes && item.likes.length ||*/ likes}</Text>

                </TouchableOpacity>

                <TouchableOpacity style={styles.icons}>
                    <Ionicons
                        name={commented ? "md-chatbubbles" : "md-chatboxes"}
                        color={commented ? 'black' : null} type="ionicon" size={25}
                        onPress={() => onPressComment()}
                    />
                    <Text style={styles.postActionText}>{/*!!item.likes && item.likes.length || */ comments}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.icons}>
                    <Ionicons
                        name="md-share"
                        type="ionicon" size={25}
                        onPress={() => console.log('share pressed')}
                    />
                    <Text style={styles.postActionText}></Text>
                </TouchableOpacity>
            </View>
        );
    }

    function displayComment(comment, index) {

        return (
            <Comment comment={comment} index={index} />
        )
    }

    function renderComments() {
        return (
            <View>
                <Text style={styles.sectionHeaderText}>{comment ? 1 : 'NO'} COMMENTS</Text>
                <View style={styles.commentContainer}>
                    {displayComment(comment, 0)}
                </View>
            </View>

        );
    }

    return (
        <View style={styles.mainContent}>
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
                            <View style={styles.postDate} >
                                <Text style={{ fontSize: 11, color: '#4C4B4B' }}>5 mins ago </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.postImageCaptionContainer} >
                    <TouchableOpacity onPress={() => console.log('Post pressed')} activeOpacity={1}>
                        {media}
                    </TouchableOpacity>
                </View>

                <View style={styles.postLogs} >
                    <LikeAndComment media={media} />
                </View>
            </View>

            {showComments ? renderComments() : null}

        </View>

    );
};

const styles = StyleSheet.create({
    icons: {
        flexDirection: 'column',
        fontSize: 200,
        fontWeight: 'bold',
        marginRight: 10
    },
    mainContent: {
        flex: 1,
    },
    postContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        marginRight: 2
    },
    postHeader: {
        height: 70,
        flexDirection: 'row',
    },
    postImageCaptionContainer: {
        alignItems: 'center',
        height: "50%",
        width: "80%"
    },
    postLogs: {
        height: 50,
        flexDirection: 'row',
        marginTop: 15

    },
    displayImageContainer: {
        flex: 2,
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
        justifyContent: 'center',
        marginLeft: 5
    },
    location: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 5
    },
    postImage: {
        width: '100%',
        height: 250,
    },
    postDate: {
        justifyContent: 'center',
    },
    postActionView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 30
    },
    postActionText: {
        marginLeft: 10,
        color: '#44484B',
        fontSize: 15,
        fontWeight: 'bold'
    },
    postLocationView: {
        flex: 1,
        justifyContent: 'center'
    },
    sectionHeaderText: {
        fontSize: 13,
        color: '#aaaaaa',
        marginVertical: 10,
        marginLeft: 10
    },
    commentContainer: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderColor: 'rgba(244,244,244,1)',
    },
    commentAvatar: {
        height: 25,
        width: 25,
        borderRadius: 13.5,
        marginLeft: 10
    },
    commentUsernameLabel: {
        fontSize: 14,
        color: '#44484B',
        marginLeft: 10,
    },
    commentContentLabel: {
        flex: 1,
        fontSize: 15,
        color: '#656A73',
        marginLeft: 10,
    },
    commentsContainer: {
        backgroundColor: 'white'
    }

});

export default PostDetails;