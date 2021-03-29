import React, { useContext, useEffect } from "react";
import PropTypes from "prop-types";

import contactData from "../../mocks/contact.json";

import Profile from "./ProfileScreen";
import { Context as AuthContext } from "../context/AuthContext";

const ProfileScreen = ({ navigation }) => {
  const { state, getUserPost, getUserInfo, getUserPlans } = useContext(AuthContext);

  useEffect(() => {
    getUserInfo({ username: state.username })

  }, [navigation])
  contactData.userInfo = state.userInfo;
  contactData.name = state.username;
  if (state.userInfo && state.userInfo.workout_plans) getUserPlans(state.userInfo.workout_plans);
  return <Profile {...contactData} />;
};

ProfileScreen.navigationOptions = () => ({
  headerShown: false,
});

ProfileScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default ProfileScreen;
