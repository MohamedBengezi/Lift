import React from 'react';
import PostDetails from '../components/PostDetails';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    StatusBar
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import colors from '../hooks/colors'
import navigate from '../navigationRef';
const ViewPostScreen = ({ navigation }) => {

    const item = navigation.getParam('item');
    const title = navigation.getParam('title');
    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate("Feed");
                }}
                style={styles.cancel}

            >
                <Ionicons
                    name="ios-arrow-round-back"
                    style={styles.icon}
                />
            </TouchableOpacity>

            <PostDetails item={item} title={title} showComments={true} />

        </View>
    );
};
const styles = StyleSheet.create({
    icon: {
        color: colors.black,
        fontWeight: "600",
        fontSize: 50,
    },
    cancel: {
        position: "absolute",
        left: 20,
        top: StatusBar.currentHeight,
        width: 50,
        height: 50
    }
});

export default ViewPostScreen;