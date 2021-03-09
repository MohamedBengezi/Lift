import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import contactData from "../../../mocks/contact.json";
import ViewProfile from "./ViewProfileScreen";
import { Context as AuthContext } from '../../context/AuthContext';

const ViewProfileScreen = ({ navigation }) => {
    let username = navigation.getParam('username');

    const { state, getUserPost, getUserInfo } = useContext(AuthContext);

    useEffect(() => {
        getUserInfo({ username: username })

    }, [navigation])
    console.log("userInfo ", state.userInfo)
    contactData.name = username;
    contactData.userInfo = state.userInfo;
    return <ViewProfile {...contactData} />;
};

ViewProfileScreen.navigationOptions = () => ({
    headerShown: false,
});

ViewProfileScreen.propTypes = {
    navigation: PropTypes.object.isRequired,
};

export default ViewProfileScreen;
