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
import { Icon } from 'react-native-elements';
import { Font } from 'expo';

import Ionicons from "react-native-vector-icons/Ionicons";
import { WebView } from "react-native-webview";
import serverApi from "../api/server";

const apiLink = serverApi.defaults.baseURL;

const Feed = ({ navigation, img, url, title }) => {
  const [likesAndComments, setLikesAndComments] = useState({ commented: false, liked: false });
  let profileImage = Image.resolveAssetSource(require("./icon.jpg"));
  let image = null,
    video = null,
    count = 0;
  let post = renderPost(url);
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
          style={{ width: 300, height: 150, borderWidth: 2 }}
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

  function LikeAndComment() {
    const { liked, commented } = likesAndComments;
    return (
      <View style={styles.postActionView}>
        <TouchableOpacity style={styles.icons}>
          <Ionicons
            name={commented ? "md-heart" : "md-heart-empty"}
            color={commented ? 'black' : null} type="ionicon" size={25}
            onPress={() => navigation.navigate('ViewPost', { post })}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.icons}>
          <Ionicons
            name={commented ? "md-chatbubbles" : "md-chatboxes"}
            color={commented ? 'black' : null} type="ionicon" size={25}
            onPress={() => navigation.navigate('ViewPost', { post })}
          />
        </TouchableOpacity>
        {/* <Text style={styles.postActionText}>{!!item.likes && item.likes.length || 0}</Text> */}
      </View>
    );
  }

  function renderPost(item) {
    const { navigate } = navigation;
    console.log("CCC", item)
    //check if video or photo
    let media;
    if (typeof item.item === 'object' && item.item !== null) {
      media = <ImageElement image={item} />
    } else {
      media = <VideoElement vid={item} />

    }
    return (
      <View style={styles.postContainer}>
        <View style={styles.postHeader}>
          <TouchableOpacity style={styles.displayImageContainer} onPress={() => console.log('Profile Image pressed')} activeOpacity={0.8}>
            <Image style={styles.avatar}
              source={{
                uri: 'https://reactnative.dev/img/tiny_logo.png',
              }} />
          </TouchableOpacity>

          <View style={styles.nameAndImageContainer} >
            <TouchableOpacity style={styles.avatarName} onPress={() => console.log('Profile pressed')} activeOpacity={0.8} >
              <Text style={{ fontSize: 17 }}>
                John Doe
              </Text>
            </TouchableOpacity>
            <View style={styles.location} >
              <Text style={{ color: 'black', fontSize: 12, fontStyle: 'italic' }}>
                location
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.postImageCaptionContainer} >
          <TouchableOpacity onPress={() => navigation.navigate("ViewPost", { media })} activeOpacity={1}>
            {media}
          </TouchableOpacity>
          <Text>
            {title}
          </Text>
        </View>

        <View style={styles.postLogs} >
          <View style={styles.postDate} >
            <Text style={{ fontSize: 11, color: '#4C4B4B' }}>5 mins ago </Text>
          </View>
          <LikeAndComment />
        </View>
      </View>
    )
  }

  const renderVid = (vid) => (
    <TouchableOpacity style={styles.container} onPress={() => viewVidPost(vid)}>
      <VideoElement vid={vid} />
    </TouchableOpacity>
  );

  const renderImage = (image) => (
    <TouchableOpacity style={styles.container} onPress={() => viewImagePost(image)}>
      <ImageElement image={image} />
    </TouchableOpacity>

  );

  function viewVidPost(item) {
    let post = <VideoElement vid={item} />
    navigation.navigate("ViewPost", { post })
  }

  function viewImagePost(item) {
    let post = <ImageElement image={item} />
    navigation.navigate("ViewPost", { post })
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
