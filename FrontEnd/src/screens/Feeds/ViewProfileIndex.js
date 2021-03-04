import React, { useContext } from "react";
import PropTypes from "prop-types";

import contactData from "../../../mocks/contact.json";

import ViewProfile from "./ViewProfileScreen";

const ViewProfileScreen = ({ navigation }) => {
    let username = navigation.getParam('username');
    console.log("XXX", username)
    contactData.name = username;
    return <ViewProfile {...contactData} />;
};

ViewProfileScreen.navigationOptions = () => ({
    headerShown: false,
});

ViewProfileScreen.propTypes = {
    navigation: PropTypes.object.isRequired,
};

export default ViewProfileScreen;
