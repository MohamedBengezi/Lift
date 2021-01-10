import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar
} from "react-native";

import { WebView } from "react-native-webview";
import PostDetails from "./PostDetails";

const Feed = ({ navigation, img, url, title }) => {
  let image = null,
    video = null,
    count = 0;
  if (img != null) {
    image = [img, img, img, img];
  } else {
    video = [url, url, url, url];
  }

  function VideoElement({ vid }) {
    return (
      <View style={styles.post}>
        <WebView
          source={{
            html: `<!DOCTYPE html>
            <html>
            <head>
                <title></title>
            </head>
            <body>
            <video id=${count} preload autoplay="false" src=${vid.item} controls="true" style="width: 50; height: 150">
            </video>
            </body>
            </html>`,
          }}
          style={{ width: 350, height: 125, borderWidth: 2 }}
        />
      </View>
    );
  }

  function ImageElement({ image }) {
    return (
      <View style={styles.post}>
        <Text>{title}</Text>
        <Image source={{ uri: image.item.uri }} style={{ width: 300, height: 150, borderWidth: 2 }} />
      </View>
    );
  }

  function renderPost(item) {
    //check if video or photo
    let media;
    if (typeof item.item === 'object' && item.item !== null) {
      media = <ImageElement image={item} />
    } else {
      media = <VideoElement vid={item} />

    }
    return (
      <TouchableOpacity style={{ margin: 10, borderRadius: 4 }} onPress={() => onPress(media)}>
        <PostDetails media={media} title={title} showComments={false} />
      </TouchableOpacity>
    )
  }

  const onPress = (media) => {
    console.log("MEDIA", media);
    navigation.navigate("ViewPost", { media, title })
  }

  function VideoPost() {
    return (
      <FlatList
        data={video}
        renderItem={(vid) => renderPost(vid)}
        keyExtractor={(vid) => vid + count++}
      />
    );
  };

  function ImagePost() {
    return (
      <FlatList
        data={image}
        renderItem={(photo) => renderPost(photo)}
        keyExtractor={(photo) => photo.uri + count++}
      />
    );

  }
  let posts;
  if (video) {
    posts = <VideoPost />
  } else {
    posts = <ImagePost />
  }

  return (
    <View style={styles.background}>
      {posts}
    </View >

  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#ffffff",
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  container: {
    alignItems: "center",
    marginTop: 20,
    borderRadius: 1,
    borderWidth: 2,
    borderColor: "black",
  },
  post: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    width: "70%",
    height: "50%"
  },
  icons: {
    flex: 1,
    flexDirection: 'row',
    fontSize: 200,
    alignItems: 'flex-start'
  },
  iconStyle: {
    position: "relative",
    fontWeight: "600",
    fontSize: 25,
    marginRight: 5
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
  },
  loadingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  list: {
    backgroundColor: 'white'
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 50,
    marginBottom: 50,
  },
  postContainer: {
    borderBottomWidth: 1,
    borderColor: '#aaaaaa'
  },
  postHeader: {
    height: 70,
    flex: 1,
    flexDirection: 'row',
  },
  postImageCaptionContainer: {
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    flex: 1
  },
  postLogs: {
    height: 50,
    flexDirection: 'row',
  },
  displayImageContainer: {
    flex: 2,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',

  },
  nameAndImageContainer: {
    flex: 9,
  },
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginLeft: 10
  },
  avatarName: {
    flex: 2,
    backgroundColor: 'white',
    justifyContent: 'center',
    marginLeft: 5
  },
  location: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    marginLeft: 5
  },
  postImage: {
    width: '100%',
    height: 250,
  },
  postDate: {
    flex: 3,
    backgroundColor: 'white',
    justifyContent: 'center',
    marginLeft: 20,
  },
  postActionView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

  },
  postActionText: {
    marginLeft: 10,
    color: '#44484B',
    fontSize: 15,
    fontFamily: 'Comfortaa'
  },

  createPostContainer: {
    flex: 1,
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fcfcfd',
    borderBottomWidth: 0.3,
    borderBottomColor: '#aaaaaa',
  },

  createPostLabel: {
    color: '#2F80ED',
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 20,
  },

  photoPostIcon: {
    marginRight: 20,
    color: '#ff99cc',
  }

});
export default Feed;
