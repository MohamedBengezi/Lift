import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator, useHeaderHeight } from "react-navigation-stack";
import { createMaterialTopTabNavigator } from "react-navigation-tabs";
import { StyleSheet, StatusBar, Text } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MainScreen from "./src/screens/MainScreen";
import ProfileScreen from "./src/screens/ProfileIndex";
import FeedScreen from "./src/screens/FeedScreen";
import FeedTwo from "./src/screens/Feeds/FeedTwo";
import FeedThree from "./src/screens/Feeds/FeedThree";
import SigninScreen from "./src/screens/SigninScreen";
import SignupScreen from "./src/screens/SignupScreen";
import IntroScreen from "./src/screens/IntroScreen";
import PostScreen from "./src/screens/PostScreen";
import { setNavigator } from "./src/navigationRef";
import HeaderLeft from "./src/components/HeaderLeft";
import ViewPostScreen from "./src/screens/ViewPostScreen";

export default function RouteScreen() {
  const styleTab = {
    activeTintColor: "blue",
    labelStyle: {
      fontSize: 20,
    },
    showIcon: true,
    showLabel: false,
    inactiveTintColor: "#DDD",
    style: { elevation: 0 },
    tabStyle: {
      height: 50,
      backgroundColor: "#fff",
    },
    scrollEnabled: false,
    swipeEnabled: true,
    upperCaseLabel: false,
  };


  const feedStyleTab = {
    ...styleTab,
    activeTintColor: "black",
    labelStyle: {
      fontSize: 15,
    },
    showLabel: true,
    tabStyle: {
      height: 50,
      marginTop: StatusBar.currentHeight + 15,
      fontSize: 10,
      backgroundColor: "#fff",
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
    Feed: FeedScreen,
    ViewPost: ViewPostScreen,
    Post: PostScreen
  },
    {
      headerMode: 'none',
      navigationOptions: {
        header: null
      },
    })

  const FeedStack = createMaterialTopTabNavigator({
    MainFeed: {
      screen: PostStack,
      navigationOptions: {
        tabBarVisible: true,
        tabBarLabel: "Posts",
        tabBarOptions: feedStyleTab,
        swipeEnabled: false
      },
    },
    FeedTwo: {
      screen: FeedTwo,
      navigationOptions: {
        tabBarVisible: true,
        tabBarLabel: "Diet Plans",
        tabBarOptions: feedStyleTab,
        swipeEnabled: false
      },
    },
    FeedThree: {
      screen: FeedThree,
      navigationOptions: {
        tabBarVisible: true,
        tabBarLabel: "Workout Plans",
        tabBarOptions: feedStyleTab,
        swipeEnabled: false
      },
    },
  },
    {
      tabBarOptions: {
        showLabel: true,
        labelStyle: { color: "#000000", fontSize: 12 },
      }
    });

  const switchNavigator = createSwitchNavigator({
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
          screen: ProfileScreen,
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
