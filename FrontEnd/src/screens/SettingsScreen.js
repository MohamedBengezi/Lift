import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Input, Button } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from "react-native-vector-icons/Ionicons";

const SettingsScreen = () => {
    const [image, setImage] = useState(null);

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })
    })

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    return (
        <View style={styles.background}>
            <View style={styles.usernameContainer}>
                <Text style={{ marginBottom: 5, marginLeft: 10 }}>Username: </Text>
                <Input style={styles.username} />
            </View>
            <View>
                <Text style={{}}>Profile Picture: </Text>

                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    {image && <Image source={{ uri: image }} style={styles.profilePicture} />}
                    <Ionicons
                        name="md-add-circle"
                        color='#000000'
                        type="ionicon" size={35}
                        style={{ marginLeft: 10 }}
                        onPress={pickImage}
                    />
                </View>
            </View>
            <View style={styles.usernameContainer}>
                <Text style={{ marginBottom: 5, marginLeft: 10 }}>Bio: </Text>
                <Input style={styles.username} />
            </View>

            <Button
                title="Save"
                onPress={() => {
                    console.log('Saved settings');
                }}
                buttonStyle={styles.button}
                titleStyle={styles.buttonText}
                containerStyle={styles.containerStyle}
            />

            <Button
                title="Link Fitbit Account"
                onPress={() => {
                    console.log('Linked fitbit')
                }}
                buttonStyle={styles.button}
                titleStyle={styles.buttonText}
                containerStyle={styles.containerStyle}
            />

            <Button
                title="Logout"
                onPress={() => {
                    console.log('logged out')
                }}
                buttonStyle={styles.button}
                titleStyle={styles.buttonText}
                containerStyle={styles.containerStyle}
            />

        </View>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: "#02bcd4",
        alignItems: 'center',
        justifyContent: 'center'
    },
    usernameContainer: {
        width: "50%",
    },
    username: {
        backgroundColor: "#ffffff",
        borderRadius: 9
    },
    profilePicture: {
        width: 130,
        height: 130,
        borderRadius: 70,
        borderWidth: 1,
        marginTop: 10,
    },
    button: {
        backgroundColor: "#ffdc5b",
        width: "70%",
        borderRadius: 5,
    },
    containerStyle: {
        justifyContent: "center",
        alignItems: "center",
        flex: 0.25,
    },
    buttonText: {
        color: "#000000",
        flex: 1,
    },

});

export default SettingsScreen;