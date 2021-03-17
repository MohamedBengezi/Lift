import React, { useState, useContext, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Alert,
    Platform
} from "react-native";
import { Input } from "react-native-elements";
import Ionicons from "react-native-vector-icons/Ionicons";
import VideoElement from "./VideoElement";
import ImageElement from "./ImageElement";
import colors from "../hooks/colors";
import { ScrollView } from "react-native-gesture-handler";
import { navigate } from "../navigationRef";
import { KeyboardAvoidingView } from "react-native";
import { Context as PostsContext } from '../context/AuthContext';
import { functions } from "../../firebase";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native";
import Header from '../components/Header';
import LikeAndComment from '../components/LikeAndComment'
import Comments from '../components/Comments';

const PostDetails = ({ item, showComments, isFeedback }) => {
    const {
        state,
        manageLikes,
        addReply,
        addComment,
        archivePost,
        markPostAsAnswered
    } = useContext(PostsContext);

    const [comments, setComments] = useState(null);
    const [image, setImage] = useState(null);
    const [answered, setAnswered] = useState(false);

    let title, mediaPath, name, uid, postID, isUsersPost, isAnswered, timeSubmitted, isImage;
    if (item) {
        postID = item.item.id;
        name = item.item.username;
        title = item.item.caption;
        mediaPath = item.item.mediaPath
        isUsersPost = (name == state.username);
        isFeedback = item.item.isFeedback;
        isImage = item.item.isImage;
        timeSubmitted = "";
        uid = item.item.uid;

        if (item.item.timeSubmitted) {
            timeSubmitted = item.item.timeSubmitted;
            timeSubmitted = timeSubmitted.substring(0, 15) + timeSubmitted.substring(timeSubmitted.length - 11, timeSubmitted.length);
        }

    } else {
        title = "title";
        mediaPath = "https://i.imgur.com/GfkNpVG.jpg";

    }
    useEffect(() => {
        let mounted = true;
        let commentsOrReplies = (isFeedback) ? "posts-getReplies" : "posts-getComments";
        setAnswered(isFeedback && item.item.answered);

        var getReplies = functions.httpsCallable(commentsOrReplies);
        if (!comments && postID !== undefined) {
            getReplies({ postid: postID }).then((res) => {
                if (mounted) {
                    setComments(res);
                }
            }).catch((error) => {
                console.error(error);
            });
        }

        async () => {
            if (Platform.OS !== "web") {
                const {
                    status,
                } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== "granted") {
                    alert("Sorry, we need camera roll permissions to make this work!");
                }
            }
        };
        return () => mounted = false;
    }, []);
    let collection = (isFeedback) ? "feedback_posts" : "general_posts";

    const [likedOrCommented, setLikedOrCommented] = useState({
        commented: false,
        liked: item.item.isLikedByUser,
        unliked: item.item.isDislikedByUser
    });
    const [likesAndComments, setLikes] = useState({
        likes: item.item.likes,
    });
    const [newComment, setNewComment] = useState("");

    const onPressLike = () => {
        let { liked, unliked } = likedOrCommented;
        let likes = likesAndComments.likes;
        if (!liked) {
            if (unliked) {
                manageLikes({ postID: postID, like: true, collection: collection });
                likes++;
            }
            setLikedOrCommented({ ...likedOrCommented, liked: true, unliked: false });
            setLikes({ ...likesAndComments, likes: likes + 1 });
            manageLikes({ postID: postID, like: true, collection: collection });

        } else {
            setLikedOrCommented({ ...likedOrCommented, liked: false });
            setLikes({ ...likesAndComments, likes: likes - 1 });
            manageLikes({ postID: postID, like: false, collection: collection });

        }
    };
    const onPressUnlike = () => {
        let { unliked, liked } = likedOrCommented;
        let likes = likesAndComments.likes;

        if (!unliked) {
            if (liked) {
                manageLikes({ postID: postID, like: false, collection: collection });
                likes--;
            }
            setLikedOrCommented({ ...likedOrCommented, liked: false, unliked: true });
            setLikes({ ...likesAndComments, likes: likes - 1 });
            manageLikes({ postID: postID, like: false, collection: collection });

        } else {
            setLikedOrCommented({ ...likedOrCommented, unliked: false });
            setLikes({ ...likesAndComments, likes: likes + 1 });
            manageLikes({ postID: postID, like: true, collection: collection });

        }
    };

    const onPressComment = () => {
        setLikedOrCommented({ ...likedOrCommented, commented: !likedOrCommented.commented });
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });


        if (!result.cancelled) {
            setImage(result);
        }
    };

    function renderAddComment() {
        return (
            <KeyboardAvoidingView
                style={styles.addComment}
                behavior={Platform.OS == "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS == "ios" ? 75 : 0}
                enabled={true}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Ionicons
                        name="md-camera"
                        color={colors.black}
                        size={25}
                        style={{ marginHorizontal: 10, position: "absolute", left: 10 }}
                        onPress={pickImage}
                    />
                    <Input
                        containerStyle={{ width: "80%" }}
                        value={newComment}
                        onChangeText={(comment) => setNewComment(comment)}
                        placeholder="Enter a comment"
                        placeholderTextColor="gray"
                        inputStyle={{ color: colors.black, fontSize: 14 }}
                        onSubmitEditing={() => {
                            setLikedOrCommented({ ...likedOrCommented, commented: true })
                            postComment();
                        }}
                    />
                </View>
            </KeyboardAvoidingView>
        );
    }

    function postComment() {
        if (newComment === "") return;

        if (isFeedback) {
            if (!image) {
                return Alert.alert(
                    "Photo Required!",
                    "Feedback posts require an image",
                    [
                        {
                            text: "Cancel",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                        },
                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ],
                    { cancelable: false }
                );
            }
            addReply({ docID: postID, comment: newComment, media: image, isFeedback: isFeedback })
        } else {
            addComment({ docID: postID, comment: newComment });
        }

        if (comments) {
            comments.data.replies.push({
                "comment": newComment,
                "disliked_by": [],
                "id": "",
                "liked_by": [],
                "likes": 0,
                "mediaPath": (image) ? image.uri : null,
                "username": state.username,
            })
            comments.data.count++
        }
        setNewComment("");
    }

    function renderArchiveButton() {
        return (
            <Ionicons
                name="md-trash"
                color={colors.black}
                size={25}
                style={{ marginLeft: 10, marginRight: 5 }}
                onPress={() => archivePost({ docID: postID })}
            />
        );
    }

    function renderAnsweredText() {
        return (
            <TouchableOpacity
                style={{ ...styles.answered, backgroundColor: (answered ? colors.blue : colors.darkGrey) }}
                onPress={() => {
                    if (!isUsersPost) return;
                    setAnswered(!answered);
                    markPostAsAnswered({ docID: postID });
                }}
            >
                <Text style={{ fontWeight: 'bold' }}>
                    ANSWERED
                </Text>
            </TouchableOpacity>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView>
                <View style={{ flex: 1 }}>
                    <View
                        style={
                            showComments ? styles.postDetailsContainer : styles.postContainer
                        }
                    >
                        <Header {...{ isFeedback, isUsersPost, showComments, name, timeSubmitted, uid, renderArchiveButton, renderAnsweredText }} />
                        <View style={showComments ? styles.postDetailsImageCaptionContainer : styles.postImageCaptionContainer}>
                            <TouchableOpacity
                                onPress={() => navigate("ViewPost", { item })}
                                activeOpacity={1}
                            >
                                {isImage ? (
                                    <ImageElement image={mediaPath} title={title} route={"ViewPost"} />
                                ) : (
                                    <VideoElement video={mediaPath} title={title} />
                                )}
                            </TouchableOpacity>
                        </View>
                        <View style={styles.postLogs}>
                            <LikeAndComment {...{ likedOrCommented, likesAndComments, comments, onPressLike, onPressUnlike, onPressComment }} />
                        </View>
                    </View>

                    {showComments ? <Comments {...{ isFeedback, comments }} /> : null}
                </View>
            </ScrollView>
            {showComments ? renderAddComment() : null}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    mainContent: {
        flex: 1,
    },
    postContainer: {
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: colors.grey,
        borderRadius: 10,
        marginRight: 2,
        height: "85%"
    },
    postDetailsContainer: {
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: colors.grey,
        borderRadius: 10,
        marginRight: 2,
        height: 450
    },
    postImageCaptionContainer: {
        alignItems: "center",
        height: "50%",
        width: "80%",
    },
    postDetailsImageCaptionContainer: {
        alignItems: "center",
        height: "40%",
        width: "80%",
    },
    postLogs: {
        height: 50,
        flexDirection: "row",
        marginTop: 80,
    },
    addComment: {
        height: 50,
        position: "absolute",
        bottom: 0,
        width: "100%",
    },
    answered: {
        borderRadius: 4,
        height: "40%",
        justifyContent: "center",
        padding: 5
    }
});

export default PostDetails;
