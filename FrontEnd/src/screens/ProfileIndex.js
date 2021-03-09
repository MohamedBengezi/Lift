import React, { useContext, useEffect } from "react";
import PropTypes from "prop-types";

import contactData from "../../mocks/contact.json";

import Profile from "./ProfileScreen";
import { Context as AuthContext } from "../context/AuthContext";

const ProfileScreen = ({ navigation }) => {
  const { state, getUserPost, getUserInfo } = useContext(AuthContext);

  useEffect(() => {
    getUserInfo({ username: state.username })

  }, [navigation])
  console.log("userInfo ", state.userInfo)
  contactData.userInfo = state.userInfo;
  contactData.name = state.username;
  return <Profile {...contactData} />;
};

ProfileScreen.navigationOptions = () => ({
  headerShown: false,
});

ProfileScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default ProfileScreen;
