import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator, useHeaderHeight } from "react-navigation-stack";
import { createMaterialTopTabNavigator } from "react-navigation-tabs";
import { StyleSheet, StatusBar, Text } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MainScreen from "./src/screens/MainScreen";
import ProfileScreen from "./src/screens/ProfileIndex";
import FeedBackScreen from "./src/screens/Feeds/FeedBackScreen";
import RegularPostsScreen from "./src/screens/Feeds/RegularPostsScreen";
import SigninScreen from "./src/screens/SigninScreen";
import SignupScreen from "./src/screens/SignupScreen";
import IntroScreen from "./src/screens/IntroScreen";
import PostScreen from "./src/screens/PostScreen";
import { setNavigator } from "./src/navigationRef";
import ViewPostScreen from "./src/screens/ViewPostScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import LoadingScreen from "./src/screens/LoadingScreen";
import colors from './src/hooks/colors';

export default function RouteScreen() {
  const styleTab = {
    activeTintColor: colors.yellow,
    labelStyle: {
      fontSize: 20,
    },
    showIcon: true,
    showLabel: false,
    inactiveTintColor: colors.black,
    style: { elevation: 0 },
    tabStyle: {
      height: 50,
      backgroundColor: colors.white,
    },
    scrollEnabled: false,
    swipeEnabled: true,
    upperCaseLabel: false,
  };


  const feedStyleTab = {
    ...styleTab,
    activeTintColor: colors.black,
    labelStyle: {
      fontSize: 15,
      fontWeight: 'bold'
    },
    showLabel: true,
    tabStyle: {
      height: 50,
      marginTop: StatusBar.currentHeight + 15,
      fontSize: 10,
      backgroundColor: colors.white,
      borderRightWidth: 1
    },
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      fontSize: 24,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
    },
    feed: {
      flex: 1,
      fontSize: 15,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
      borderWidth: 2,
    },
  });

  const PostStack = createStackNavigator({
    Feed: FeedBackScreen,
    ViewPost: ViewPostScreen,
    Post: PostScreen
  },
    {
      headerMode: 'none',
      headerShown: false,
    })

  const ProfileStack = createStackNavigator({
    Profile: ProfileScreen,
    Settings: {
      screen: SettingsScreen,
      navigationOptions: {
        headerMode: 'none',
        headerShown: false,
        animationEnabled: false

      },
    }
  })

  const FeedStack = createMaterialTopTabNavigator({
    FeedbackFeed: {
      screen: PostStack,
      navigationOptions: {
        tabBarVisible: true,
        tabBarLabel: ({ tintColor, focused, item }) => {
          return focused
            ? (<Text style={{ fontWeight: 'bold', }} >Feedback</Text>)
            : (<Text style={{ fontWeight: 'normal', fontSize: 15 }} >Feedback</Text>)
        }, tabBarOptions: feedStyleTab,
        swipeEnabled: false
      },
    },
    RegularFeed: {
      screen: RegularPostsScreen,
      navigationOptions: {
        tabBarVisible: true,
        tabBarLabel: ({ tintColor, focused, item }) => {
          return focused
            ? (<Text style={{ fontWeight: 'bold', }} >Regular</Text>)
            : (<Text style={{ fontWeight: 'normal', fontSize: 15 }} >Regular</Text>)
        },
        tabBarOptions: feedStyleTab,
        swipeEnabled: false
      },
    },
  },
    {
      tabBarOptions: {
        showLabel: true,
        labelStyle: { color: colors.black, fontSize: 12 },
      }
    });

  const switchNavigator = createSwitchNavigator({
    loading: LoadingScreen,
    loginFlow: createStackNavigator({
      Intro: IntroScreen,
      Signup: SignupScreen,
      Signin: SigninScreen,
    }),
    mainFlow: createMaterialTopTabNavigator(
      {
        Feed: {
          screen: FeedStack,
          navigationOptions: {
            tabBarVisible: true,
            tabBarLabel: "Feed",
            tabBarOptions: styleTab,
            tabBarIcon: ({ focused, horizontal, tintColor }) => {
              let iconName = `md-paper`;
              return (
                <Ionicons
                  name={iconName}
                  size={horizontal ? 20 : 25}
                  color={tintColor}
                  style={styles.container}
                />
              );
            },
          },
        },
        Main: {
          screen: MainScreen,
          navigationOptions: {
            tabBarVisible: true,
            tabBarLabel: "Main",
            tabBarOptions: styleTab,
            tabBarIcon: ({ focused, horizontal, tintColor }) => {
              let iconName = `md-camera`;
              return (
                <Ionicons
                  name={iconName}
                  size={horizontal ? 20 : 25}
                  color={tintColor}
                  style={styles.container}
                />
              );
            },
          },
        },
        Profile: {
          screen: ProfileStack,
          navigationOptions: {
            tabBarVisible: true,
            tabBarLabel: "Profile",
            tabBarOptions: styleTab,
            tabBarIcon: ({ focused, horizontal, tintColor }) => {
              let iconName = `md-person`;
              return (
                <Ionicons
                  name={iconName}
                  size={horizontal ? 20 : 25}
                  color={tintColor}
                  style={styles.container}
                />
              );
            },
          },
        },
      },
      {
        initialRouteName: "Main",
        tabBarPosition: "bottom",
      }
    ),
  });
  const App = createAppContainer(switchNavigator);

  return (
    <App
      ref={(navigator) => {
        setNavigator(navigator);
      }}
    />
  );
}
