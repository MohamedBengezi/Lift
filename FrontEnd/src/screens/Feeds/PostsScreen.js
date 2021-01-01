import React from "react";
import {
  StyleSheet,
} from "react-native";
import serverApi from "../../api/server";
import Feed from '../../components/Feed';

const apiLink = serverApi.defaults.baseURL;

const PostsScreen = ({ navigation }) => {
  return (
    <Feed navigation={navigation} />
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
  }
});
export default PostsScreen;
