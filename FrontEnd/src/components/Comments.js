import React, { useReducer } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import colors from '../hooks/colors';
import Comment from './Comment';

const Comments = ({ isFeedback, comments }) => {

    function displayComment(comment) {
        return (
            <Comment
                comment={comment.item}
                key={comment.index}
                index={comment.index}
                isFeedback={isFeedback}
            />
        );
    }

    return (
        <View>
            <Text style={styles.sectionHeaderText}>{comments ? comments.data.count : 0} COMMENTS</Text>

            {(comments) ?
                <FlatList
                    data={comments.data.replies}
                    renderItem={(item) => displayComment(item)}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={true}
                    contentContainerStyle={{ paddingBottom: "30%" }}
                /> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    sectionHeaderText: {
        fontSize: 13,
        color: colors.darkGrey,
        marginVertical: 10,
        marginLeft: 10,
    },
});

export default Comments;