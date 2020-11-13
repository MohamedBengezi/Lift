import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, TouchableHighlight } from 'react-native';
import Button from '../components/common/Button';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import { FlingGestureHandler, Directions } from 'react-native-gesture-handler'
import HeaderLeft from '../components/HeaderLeft';
import HeaderRight from '../components/HeaderRight';
import Ionicons from 'react-native-vector-icons/Ionicons';

const MainScreen = ({ navigation }) => {
    const [camera, setCamera] = useState({
        hasCameraPermission: null,
        type: Camera.Constants.Type.back,
    });

    const [image, setImage] = useState(null);

    useEffect(() => {
        const runEffect = async () => {
            const { status } = await Permissions.askAsync(Permissions.CAMERA);

            setCamera(prevState => ({ ...prevState, hasCameraPermission: status === 'granted' }));
        };
        runEffect()
    }, []);

    takePicture = () => {
        if (this.camera) {
            const options = { quality: 1, base64: false };
            this.camera.takePictureAsync({ onPictureSaved: this.onPictureSaved });
        }
    };

    onPictureSaved = photo => {
        str = JSON.stringify(photo);
        console.log("Image: " + str);
        setImage(photo);
    }

    if (camera.hasCameraPermission === null) {
        return <View />;
    } else if (camera.hasCameraPermission === false) {
        return <Text>No access to camera</Text>;
    } else {
        if (image != null) {
            return (
                <View>
                    <Image
                        source={{ uri: image.uri }}
                        style={styles.preview}
                    />
                    <Ionicons name="md-send" style={styles.post} onPress={() => navigation.navigate('Feed', { image })} />


                    <Ionicons name="md-backspace" onPress={() => setImage(null)} style={styles.cancel} />

                </View>
            );
        } else {
            return (
                <View style={{ flex: 1 }}>

                    <Camera style={{ flex: 1 }} type={camera.type} ref={(ref) => { this.camera = ref }} >
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: 'transparent',
                                flexDirection: 'column',
                            }}>
                            <TouchableOpacity
                                style={{
                                    flex: 0.1,
                                    alignSelf: 'flex-end',
                                    alignItems: 'center',
                                }}
                                onPress={() => {
                                    setCamera({
                                        type:
                                            camera.type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back,
                                    });
                                }}>
                                <Text style={styles.flip} >
                                    <Ionicons name="md-camera" style={styles.flip} />
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.menu}>

                            <TouchableHighlight
                                style={styles.capture}
                                onPress={takePicture}
                                underlayColor="rgba(255, 255, 255, 0.5)"
                            >
                                <View />
                            </TouchableHighlight>

                        </View>
                    </Camera>
                </View>
            )
        }

    }
}



MainScreen.navigationOptions = {
    title: 'Lift',
    headerShown: false
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
    },
    preview: {
        alignItems: 'center',
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
        resizeMode: 'cover'

    },
    capture: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 5,
        borderColor: '#FFF',
        marginBottom: 50,
        alignSelf: 'center',
    },
    cancel: {
        position: 'absolute',
        left: 20,
        top: 40,
        color: '#ffffff',
        fontWeight: '600',
        fontSize: 28,
    },
    post: {
        position: 'absolute',
        right: 20,
        top: 40,
        color: '#ffffff',
        fontWeight: '600',
        fontSize: 28,
    },
    flip: {
        fontSize: 28,
        marginTop: 30,
        marginRight: 30,
        color: 'white'
    },
    menu: {
        justifyContent: 'space-around',
        flexDirection: "row"

    }
});

export default MainScreen;