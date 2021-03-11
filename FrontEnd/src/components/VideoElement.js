import React, { useReducer } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { WebView } from "react-native-webview";
import { Video } from "expo-av";



const VideoElement = ({ title, video }) => {
    return (
        <View style={styles.post}>
            <Text>{title}</Text>
            <Video
                source={{
                    uri: video,
                }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="contain"
                shouldPlay
                isLooping
                style={styles.video}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    post: {
        flex: 1,
        flexDirection: "column",
        width: "70%",
        height: "50%"
    },
    video: {
        width: Dimensions.get('window').width - 20,
        height: 250,
        resizeMode: "cover",
        opacity: 0.99
    }
});

export default VideoElement;