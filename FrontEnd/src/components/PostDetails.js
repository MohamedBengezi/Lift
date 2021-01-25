import React, { useState, useContext } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    FlatList,
    StatusBar
} from "react-native";
import { Input } from "react-native-elements";
import Ionicons from "react-native-vector-icons/Ionicons";
import Comment from "./Comment";
import VideoElement from "./VideoElement";
import ImageElement from "./ImageElement";
import colors from "../hooks/colors";
import { ScrollView } from "react-native-gesture-handler";
import { navigate } from "../navigationRef";
import { KeyboardAvoidingView } from "react-native";
import { Context as PostsContext } from '../context/AuthContext';

const PostDetails = ({ item, showComments, isFeedback }) => {
    const { state, manageLikes } = useContext(PostsContext);


    let title, mediaPath, name, postID;
    if (item) {
        postID = item.item.id;
        name = item.item.username;
        title = item.item.caption;
        mediaPath = item.item.mediaPath
    } else {
        title = "title";
        mediaPath = "https://reactnative.dev/img/tiny_logo.png";

    }

    let collection = (isFeedback) ? "feedback_posts" : "general_posts";

    const [likedOrCommented, setLikedOrCommented] = useState({
        commented: false,
        liked: false,
        unliked: false
    });
    const [likesAndComments, setLikesAndComments] = useState({
        likes: item.item.likes,
        comments: item.item.comments_number,
    });
    const [newComment, setNewComment] = useState("");
    const [comments, setComments] = useState([
        {
            user: {
                id: 123,
                username: "johndoe",
                name: "John Doe",
                profile_image: "https://reactnative.dev/img/tiny_logo.png",
            },
            description: "This is a sick photo man!",
        },
    ]);

    const onPressLike = () => {
        let { liked } = likedOrCommented;
        let likes = likesAndComments.likes;

        if (!liked) {
            setLikedOrCommented({ liked: true, unliked: false });
            setLikesAndComments({ ...likesAndComments, likes: likes + 1 });
            manageLikes({ postID: postID, like: true, collection: collection });

        } else {
            setLikedOrCommented({ liked: false });
            setLikesAndComments({ ...likesAndComments, likes: likes - 1 });
            manageLikes({ postID: postID, like: false, collection: collection });

        }
    };
    const onPressUnlike = () => {
        let { unliked } = likedOrCommented;
        let likes = likesAndComments.likes;

        if (!unliked) {
            setLikedOrCommented({ liked: false, unliked: true });
            setLikesAndComments({ ...likesAndComments, likes: likes - 1 });
            manageLikes({ postID: postID, like: false, collection: collection });

        } else {
            setLikedOrCommented({ unliked: false });
            setLikesAndComments({ ...likesAndComments, likes: likes + 1 });
            manageLikes({ postID: postID, like: true, collection: collection });

        }
    };

    const onPressComment = () => {
        setLikedOrCommented({ commented: !likedOrCommented.commented });
    };

    function LikeAndComment() {
        const { liked, unliked, commented } = likedOrCommented;
        const { likes } = likesAndComments;
        return (
            <View style={styles.postActionView}>
                <View style={{ flexDirection: 'column', alignItems: 'center', marginRight: 5 }}>
                    <View style={{ flexDirection: "row", alignItems: 'center' }}>
                        <TouchableOpacity style={styles.icons}>
                            <Ionicons
                                name="md-thumbs-up"
                                color={liked ? colors.blue : colors.black}
                                type="ionicon"
                                size={25}
                                onPress={() => onPressLike(liked)}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.icons}>
                            <Ionicons
                                name="md-thumbs-down"
                                color={unliked ? colors.yellow : colors.black}
                                type="ionicon"
                                size={25}
                                onPress={() => onPressUnlike(unliked)}
                            />
                        </TouchableOpacity>
                    </View>
                    <Text style={{ color: colors.reallyDarkGrey, fontSize: 15, fontWeight: "bold" }}>
                        {/*!!item.likes && item.likes.length ||*/ likes}
                    </Text>
                </View>



                <TouchableOpacity style={styles.icons}>
                    <Ionicons
                        name={commented ? "md-chatbubbles" : "md-chatboxes"}
                        color={commented ? colors.black : colors.black}
                        type="ionicon"
                        size={25}
                        style={{ marginRight: 5 }}
                        onPress={() => onPressComment()}
                    />
                    <Text style={styles.postActionText}>
                        {/*!!item.likes && item.likes.length || */ comments.length}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.icons}>
                    <Ionicons
                        name="md-share"
                        type="ionicon"
                        size={25}
                        onPress={() => console.log("share pressed")}
                    />
                    <Text style={styles.postActionText}></Text>
                </TouchableOpacity>
            </View>
        );
    }

    function displayComment(comment) {
        return (
            <Comment
                comment={comment.item}
                key={comment.index}
                index={comment.index}
            />
        );
    }

    function renderComments() {
        return (
            <ScrollView>
                <Text style={styles.sectionHeaderText}>{comments.length} COMMENTS</Text>
                <FlatList
                    data={comments}
                    renderItem={(comment) => displayComment(comment)}
                    keyExtractor={(item, index) => index.toString()}
                    style={{ height: "37%" }}
                />
            </ScrollView>
        );
    }

    function renderAddComment() {
        return (
            <KeyboardAvoidingView
                style={styles.addComment}
                behavior={Platform.OS == "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS == "ios" ? 10 : 20}
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
                        name="md-chatbubbles"
                        color={colors.black}
                        size={25}
                        style={{ marginHorizontal: 10, position: "absolute", left: 10 }}
                    />
                    <Input
                        containerStyle={{ width: "80%" }}
                        value={newComment}
                        onChangeText={(comment) => setNewComment(comment)}
                        placeholder="Enter a comment"
                        placeholderTextColor="gray"
                        inputStyle={{ color: colors.black, fontSize: 14 }}
                        onSubmitEditing={() => {
                            setLikedOrCommented({ commented: true })
                            postComment();
                        }}
                    />
                </View>
            </KeyboardAvoidingView>
        );
    }

    function postComment() {
        if (newComment === "") return;
        let cmt = {
            user: {
                id: 123,
                username: "johndoe",
                name: "John Doe",
                profile_image: "https://reactnative.dev/img/tiny_logo.png",
            },
            description: "",
        };
        cmt.description = newComment;
        setNewComment("");
        setComments([...comments, cmt]);
    }
    const likes = (
        <View style={styles.postLogs}>
            <LikeAndComment />
        </View>
    );
    return (
        <View style={{ flex: 1 }}>
            <View style={
                showComments ? { flex: 1, marginTop: StatusBar.currentHeight + 40 } : { flex: 1, height: 400 }
            }>
                <View
                    style={
                        showComments ? styles.postDetailsContainer : styles.postContainer
                    }
                >
                    <View style={showComments ? styles.postDetailsHeader : styles.postHeader}>
                        <TouchableOpacity
                            style={styles.displayImageContainer}
                            onPress={() => console.log("Profile Image pressed")}
                            activeOpacity={0.8}
                        >
                            <Image
                                style={styles.avatar}
                                source={{
                                    uri: "https://reactnative.dev/img/tiny_logo.png",
                                }}
                            />
                        </TouchableOpacity>

                        <View style={styles.nameAndImageContainer}>
                            <TouchableOpacity
                                style={styles.avatarName}
                                onPress={() => console.log("Profile pressed")}
                                activeOpacity={0.8}
                            >
                                <Text style={{ fontSize: 17 }}>{name}</Text>
                                <View style={styles.postDate}>
                                    <Text style={{ fontSize: 11, color: colors.reallyDarkGrey }}>
                                        5 mins ago{" "}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={showComments ? styles.postDetailsImageCaptionContainer : styles.postImageCaptionContainer}>
                        <TouchableOpacity
                            onPress={() => navigate("ViewPost", { item })}
                            activeOpacity={1}
                        >
                            {mediaPath ? (
                                <ImageElement image={mediaPath} title={title} />
                            ) : (
                                    <VideoElement video={item} title={title} />
                                )}
                        </TouchableOpacity>
                    </View>
                    {likes}
                </View>

                {showComments ? renderComments() : null}
            </View>
            {showComments ? renderAddComment() : null}
        </View>
    );
};

const styles = StyleSheet.create({
    icons: {
        flexDirection: "column",
        fontSize: 200,
        fontWeight: "bold",
        marginRight: 10,
    },
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
    },
    postDetailsContainer: {
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: colors.grey,
        borderRadius: 10,
        marginRight: 2,
        height: "56%"
    },
    postDetailsHeader: {
        height: 70,
        flexDirection: "row",
        marginBottom: -40
    },
    postHeader: {
        height: 70,
        flexDirection: "row",
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
        marginLeft: 5,
    },
    location: {
        flex: 1,
        justifyContent: "center",
        marginLeft: 5,
    },
    postImage: {
        width: "100%",
        height: 250,
    },
    postDate: {
        justifyContent: "center",
    },
    postActionView: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 30,
    },
    postActionText: {
        marginLeft: 10,
        color: colors.reallyDarkGrey,
        fontSize: 15,
        fontWeight: "bold",
    },
    postLocationView: {
        flex: 1,
        justifyContent: "center",
    },
    sectionHeaderText: {
        fontSize: 13,
        color: colors.darkGrey,
        marginVertical: 10,
        marginLeft: 10,
    },
    addComment: {
        height: 50,
        position: "absolute",
        bottom: 0,
        width: "100%",
    },
});

export default PostDetails;
