import React, { useContext } from "react";
import PropTypes from "prop-types";

import contactData from "../../mocks/contact.json";

import Profile from "./ProfileScreen";
import { Context as AuthContext } from "../context/AuthContext";

const ProfileScreen = () => {
  const { state } = useContext(AuthContext);
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
