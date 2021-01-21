import React, { useReducer } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';



const ImageElement = ({ title, image }) => {
    return (
        <View style={styles.post}>
            <Text style={{ marginLeft: 50 }}>{title}</Text>
            <Image source={{ uri: image.item.uri }} style={styles.image} />
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
    image: {
        width: Dimensions.get('window').width - 20,
        height: 125,
        resizeMode: "cover",
    }
});

export default ImageElement;