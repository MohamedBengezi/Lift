import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    FlatList,
} from "react-native";
import { Input } from "react-native-elements";
import Ionicons from "react-native-vector-icons/Ionicons";
import Comment from "./Comment";
import VideoElement from "./VideoElement";
import ImageElement from "./ImageElement";
import colors from "../hooks/colors";
import { ScrollView } from "react-native-gesture-handler";

const PostDetails = ({ item, title, showComments }) => {
    const [likedOrCommented, setLikedOrCommented] = useState({
        commented: false,
        liked: false,
    });
    const [likesAndComments, setLikesAndComments] = useState({
        likes: 0,
        comments: 0,
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
        let liked = !likedOrCommented.liked;
        let likes = likesAndComments.likes;
        if (!liked) {
            setLikesAndComments({ ...likesAndComments, likes: likes - 1 });
        } else {
            setLikesAndComments({ ...likesAndComments, likes: likes + 1 });
        }
        setLikedOrCommented({ liked: liked });
    };

    const onPressComment = () => {
        setLikedOrCommented({ commented: !likedOrCommented.commented });
    };

    function LikeAndComment() {
        const { liked, commented } = likedOrCommented;
        const { likes } = likesAndComments;
        return (
            <View style={styles.postActionView}>
                <TouchableOpacity style={styles.icons}>
                    <Ionicons
                        name={liked ? "md-heart" : "md-heart-empty"}
                        color={liked ? colors.red : null}
                        type="ionicon"
                        size={25}
                        onPress={() => onPressLike()}
                    />
                    <Text style={styles.postActionText}>
                        {/*!!item.likes && item.likes.length ||*/ likes}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.icons}>
                    <Ionicons
                        name={commented ? "md-chatbubbles" : "md-chatboxes"}
                        color={commented ? colors.black : null}
                        type="ionicon"
                        size={25}
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
            <View style={styles.addComment}>
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
            </View>
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

    return (
        <View style={{ flex: 1 }}>
            <View
                style={
                    showComments ? styles.postDetailsContainer : styles.postContainer
                }
            >
                <View style={styles.postHeader}>
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
                            <Text style={{ fontSize: 17 }}>John Doe</Text>
                            <View style={styles.postDate}>
                                <Text style={{ fontSize: 11, color: colors.reallyDarkGrey }}>
                                    5 mins ago{" "}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.postImageCaptionContainer}>
                    <TouchableOpacity
                        onPress={() => console.log("Post pressed")}
                        activeOpacity={1}
                    >
                        {item.item !== null && typeof item.item === "object" ? (
                            <ImageElement image={item} title={title} />
                        ) : (
                                <VideoElement video={item} title={title} />
                            )}
                    </TouchableOpacity>
                </View>

                <View style={styles.postLogs}>
                    <LikeAndComment />
                </View>
            </View>
            {showComments ? renderComments() : null}
            {showComments && !likedOrCommented.commented ? renderAddComment() : null}
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
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.grey,
        borderRadius: 10,
        marginRight: 2,
    },
    postDetailsContainer: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.grey,
        borderRadius: 10,
        marginRight: 2,
        height: 300,
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
    postLogs: {
        height: 50,
        flexDirection: "row",
        marginTop: 15,
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
        backgroundColor: colors.lightGrey,
        width: "100%",
    },
});

export default PostDetails;
