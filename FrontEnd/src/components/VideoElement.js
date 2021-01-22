import React, { useReducer } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { WebView } from "react-native-webview";



const VideoElement = ({ title, video }) => {
    return (
        <View style={styles.post}>
            <Text style={{ marginLeft: 50 }}>{title}</Text>
            <WebView
                source={{
                    html: `<!DOCTYPE html>
              <html>
              <head>
                  <title></title>
              </head>
              <body>
              <video preload autoplay="false" src=${video.item} controls="true" style="width: 50; height: 150">
              </video>
              </body>
              </html>`,
                }}
                style={styles.video}

            />
        </View>
    );
};

const styles = StyleSheet.create({
    post: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-start",
        width: "70%",
        height: "50%"
    },
    video: {
        width: Dimensions.get('window').width - 20,
        height: 125,
        resizeMode: "cover",
        opacity: 0.99
    }
});

export default VideoElement;