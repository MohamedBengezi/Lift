import React from 'react';
import { StyleSheet } from 'react-native';
import serverApi from "../../api/server";
import Feed from '../../components/Feed';

const apiLink = serverApi.defaults.baseURL;

const RegularPostsScreen = ({ navigation }) => {
    url = apiLink + "/sample";

    let img = (navigation.getParam('image')) ? navigation.getParam('image') : null;
    let title = (navigation.getParam('title')) ? navigation.getParam('title') : "this is a post";


    return (
        <Feed img={img} url={url} title={title} />
    );
};

const styles = StyleSheet.create({

});

export default RegularPostsScreen; 