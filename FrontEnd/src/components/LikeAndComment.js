import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../hooks/colors';
import Ionicons from "react-native-vector-icons/Ionicons";


const LikeAndComment = ({ likedOrCommented, likesAndComments, comments, onPressLike, onPressUnlike, onPressComment }) => {
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
                            size={25}
                            onPress={() => onPressLike()}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.icons}>
                        <Ionicons
                            name="md-thumbs-down"
                            color={unliked ? colors.yellow : colors.black}
                            size={25}
                            onPress={() => onPressUnlike()}
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
                    size={25}
                    style={{ marginRight: 5 }}
                    onPress={() => onPressComment()}
                />
                <Text style={styles.postActionText}>
                    {comments ? comments.data.count : 0}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.icons}>
                <Ionicons
                    name="md-share"
                    size={25}
                    onPress={() => console.log("share pressed")}
                />
                <Text style={styles.postActionText}></Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
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
    icons: {
        flexDirection: "column",
        fontSize: 200,
        fontWeight: "bold",
        marginRight: 10,
    },
});

export default LikeAndComment;