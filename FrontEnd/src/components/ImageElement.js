import React, { useReducer } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';



const ImageElement = ({ title, image }) => {
    return (
        <View style={styles.post}>
            <Text >{title}</Text>
            <Image source={{ uri: image }} style={styles.image} />
        </View>
    );
};

const styles = StyleSheet.create({
    post: {
        flex: 1
    },
    image: {
        aspectRatio: 1.5,
        width: Dimensions.get('window').width - 20,
        height: 250,
    }
});

export default ImageElement;