import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    Platform,
    Linking
} from "react-native";

import { Card, CardItem, Thumbnail, Body, Left, Right, Button } from 'native-base';
import { WebView } from 'react-native-webview';
import { Dimensions } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const scale = size => (width / guidelineBaseWidth) * size;

let pinthtml = "";

class CardComponent extends Component {

    componentDidMount() {
        if (this.props.pinterest) {
            pinthtml = '<html style="height: 100%; width: 100%;"><head><title>Pinterest render</title></head><body style="height: 100%; width: 100%;"><div style="height: 100%; width: 100%; overflow:hidden;"><a data-pin-width="large" data-pin-do="embedPin" data-pin-lang="fr" href="https://www.pinterest.com/pin/' + this.props.id_pinterest + '/"></a></div><script async defer src="//assets.pinterest.com/js/pinit.js"></script></body></html>';
            console.log(pinthtml)
        }
    }

    render() {
        return (
            <SafeAreaView >
                <ScrollView>
                    <Card style={styles.container}>
                        <CardItem>
                            <Left>
                                <Thumbnail source={this.props.thumbnail} />
                                <Body>
                                    <Text style={{ fontWeight: "900" }}>{this.props.pseudo} </Text>
                                    <Text note>{this.props.date}</Text>
                                </Body>
                            </Left>
                        </CardItem>
                        <CardItem style={{ height: this.props.instagram ? scale(420) : scale(300) }}>
                            {this.props.youtube ?
                                <Image
                                    style={styles.imageStyle}
                                    source={{ uri: this.props.post.uri }}
                                />
                                : null
                            }

                            {this.props.twitch_live ?
                                <WebView
                                    javaScriptEnabled={true}
                                    onShouldStartLoadWithRequest={(event) => {
                                        if (event.url !== 'https://player.twitch.tv/?volume=0.5&!muted&!autoplay&channel=' + this.props.chaine_twitch) {
                                            return false;
                                        } else {
                                            return true;
                                        }
                                    }}
                                    source={{ uri: 'https://player.twitch.tv/?volume=0.5&!muted&!autoplay&channel=' + this.props.chaine_twitch }}
                                />
                                : null
                            }

                            {this.props.twitch_videos ?
                                <WebView
                                    javaScriptEnabled={true}
                                    onShouldStartLoadWithRequest={(event) => {
                                        if (event.url !== 'https://player.twitch.tv/?volume=0.5&!muted&!autoplay&video=v' + this.props.id_twitch_video + '&collection=&time=') {
                                            return false;
                                        } else {
                                            return true;
                                        }
                                    }}
                                    source={{ uri: 'https://player.twitch.tv/?volume=0.5&!muted&!autoplay&video=v' + this.props.id_twitch_video + '&collection=&time=' }}
                                />
                                : null
                            }

                            {this.props.twitch_clips ?
                                <WebView
                                    javaScriptEnabled={true}
                                    ref={(ref) => { this.videoPlayer = ref; }}
                                    onShouldStartLoadWithRequest={(event) => {
                                        if (event.url !== 'https://clips.twitch.tv/embed?volume=0.5&!muted&!autoplay&clip=' + this.props.id_twitch_clip) {
                                            return false;
                                        } else {
                                            return true;
                                        }
                                    }}
                                    source={{ uri: 'https://clips.twitch.tv/embed?volume=0.5&!muted&!autoplay&clip=' + this.props.id_twitch_clip }}
                                />
                                : null
                            }

                            {this.props.twitch_collections ?
                                <WebView
                                    javaScriptEnabled={true}
                                    onShouldStartLoadWithRequest={(event) => {
                                        if (event.url !== 'https://player.twitch.tv/?volume=0.5&!muted&!autoplay&video=v' + this.props.id_twitch_video + '&collection=' + this.props.id_twitch_collection + '&time=') {
                                            return false;
                                        } else {
                                            return true;
                                        }
                                    }}
                                    source={{ uri: 'https://player.twitch.tv/?volume=0.5&!muted&!autoplay&video=v' + this.props.id_twitch_video + '&collection=' + this.props.id_twitch_collection + '&time=' }}
                                />
                                : null
                            }

                            {this.props.instagram ?
                                <WebView
                                    originWhitelist={['*']}
                                    javaScriptEnabled={true}
                                    onShouldStartLoadWithRequest={(event) => {
                                        if (event.url !== 'https://www.instagram.com/p/' + this.props.id_instagram_post + '/embed/captioned/') {
                                            return false;
                                        } else {
                                            return true;
                                        }
                                    }}
                                    source={{ uri: 'https://www.instagram.com/p/' + this.props.id_instagram_post + '/embed/captioned/' }}
                                />
                                : null
                            }

                            {this.props.spotify_album ?
                                <WebView
                                    originWhitelist={['*']}
                                    javaScriptEnabled={true}
                                    source={{ uri: 'https://open.spotify.com/embed/album/' + this.props.id_spotify }}
                                    onShouldStartLoadWithRequest={(event) => {
                                        if (event.url !== 'https://open.spotify.com/embed/album/' + this.props.id_spotify) {
                                            return false;
                                        } else {
                                            return true;
                                        }
                                    }}
                                />
                                : null
                            }

                            {this.props.spotify_playlist ?
                                <WebView
                                    originWhitelist={['*']}
                                    javaScriptEnabled={true}
                                    source={{ uri: 'https://open.spotify.com/embed/user/' + this.props.id_user + '/playlist/' + this.props.id_spotify }}
                                    onShouldStartLoadWithRequest={(event) => {
                                        if (event.url !== 'https://open.spotify.com/embed/user/' + this.props.id_user + '/playlist/' + this.props.id_spotify) {
                                            return false;
                                        } else {
                                            return true;
                                        }
                                    }}
                                />
                                : null
                            }

                            {this.props.spotify_song ?
                                <WebView
                                    originWhitelist={['*']}
                                    javaScriptEnabled={true}
                                    source={{ uri: 'https://open.spotify.com/embed/track/' + this.props.id_spotify }}
                                    onShouldStartLoadWithRequest={(event) => {
                                        if (event.url !== 'https://open.spotify.com/embed/track/' + this.props.id_spotify) {
                                            return false;
                                        } else {
                                            return true;
                                        }
                                    }}
                                />
                                : null
                            }

                            {this.props.pinterest ?
                                <WebView
                                    originWhitelist={['*']}
                                    javaScriptEnabled={true}
                                    source={{ html: pinthtml }}
                                />
                                : null
                            }

                        </CardItem>
                        <CardItem style={{ height: 30 }}>
                            <Left>
                                <Button transparent>
                                    <Ionicons name="md-heart" color='black' />
                                    <Text> {this.props.likes}</Text>
                                </Button>
                                <Button transparent>
                                    <Ionicons name="md-chatbubbles" color="black" />
                                    <Text> {this.props.nb_commentaires}</Text>
                                </Button>
                            </Left>
                            <Right>
                                <Button transparent>
                                    <Ionicons name="md-heart" color="black" />
                                </Button>
                            </Right>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <Text>
                                    <Text style={{ fontWeight: "900" }}>{this.props.pseudo} </Text>
                                    {this.props.description}
                                </Text>
                            </Body>
                        </CardItem>
                    </Card>
                </ScrollView>
            </SafeAreaView>

        );
    }
}
export default CardComponent;

const styles = StyleSheet.create({
    container: {
        marginTop: 0
    },
    WebViewContainer: {
        marginTop: (Platform.OS == 'android') ? 20 : 0,
    },
    imageStyle: {
        height: 370,
        width: 370,
        resizeMode: 'cover'
    }
});