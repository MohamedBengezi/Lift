import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import contactData from "../../../mocks/contact.json";
import ViewProfile from "./ViewProfileScreen";
import { Context as AuthContext } from '../../context/AuthContext';

const ViewProfileScreen = ({ navigation }) => {
    let username = navigation.getParam('username');
    let uid = navigation.getParam('uid');

    const { state, getUserPost, getOtherUserInfo } = useContext(AuthContext);

    useEffect(() => {
        getOtherUserInfo({ username: username })

    }, [navigation])
   // getOtherUserInfo({ username: username });
   // console.log("userInfo ", state.getOtherUserInfo)
    contactData.name = username;
    contactData.uid = uid;
    contactData.userInfo = state.userInfo;
   // console.log(contactData);
    return <ViewProfile {...contactData} />;
};

ViewProfileScreen.navigationOptions = () => ({
    headerShown: false,
});

ViewProfileScreen.propTypes = {
    navigation: PropTypes.object.isRequired,
};

export default ViewProfileScreen;
