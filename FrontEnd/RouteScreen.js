import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator, useHeaderHeight } from "react-navigation-stack";
import { createMaterialTopTabNavigator } from "react-navigation-tabs";
import { StyleSheet, StatusBar, Text } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MainScreen from "./src/screens/MainScreen";
import ProfileScreen from "./src/screens/ProfileIndex";
import PostsScreen from "./src/screens/Feeds/PostsScreen";
import DietPlansScreen from "./src/screens/Feeds/DietPlansScreen";
import WorkoutPlansScreen from "./src/screens/Feeds/WorkoutPlansScreen";
import SigninScreen from "./src/screens/SigninScreen";
import SignupScreen from "./src/screens/SignupScreen";
import IntroScreen from "./src/screens/IntroScreen";
import PostScreen from "./src/screens/PostScreen";
import { setNavigator } from "./src/navigationRef";
import ViewPostScreen from "./src/screens/ViewPostScreen";

export default function RouteScreen() {
  const styleTab = {
    activeTintColor: "yellow",
    labelStyle: {
      fontSize: 20,
    },
    showIcon: true,
    showLabel: false,
    inactiveTintColor: "#000",
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
      fontWeight: 'bold'
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
    Feed: PostsScreen,
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
        tabBarLabel: ({ tintColor, focused, item }) => {
          return focused
            ? (<Text style={{ fontWeight: 'bold', }} >Posts</Text>)
            : (<Text style={{ fontWeight: 'normal', fontSize: 15 }} >Posts</Text>)
        }, tabBarOptions: feedStyleTab,
        swipeEnabled: false
      },
    },
    DietFeed: {
      screen: DietPlansScreen,
      navigationOptions: {
        tabBarVisible: true,
        tabBarLabel: ({ tintColor, focused, item }) => {
          return focused
            ? (<Text style={{ fontWeight: 'bold', }} >Diet Plans</Text>)
            : (<Text style={{ fontWeight: 'normal', fontSize: 15 }} >Diet Plans</Text>)
        },
        tabBarOptions: feedStyleTab,
        swipeEnabled: false
      },
    },
    WorkoutPlanFeed: {
      screen: WorkoutPlansScreen,
      navigationOptions: {
        tabBarVisible: true,
        tabBarLabel: ({ tintColor, focused, item }) => {
          return focused
            ? (<Text style={{ fontWeight: 'bold', }} >Workout Plans</Text>)
            : (<Text style={{ fontWeight: 'normal', fontSize: 15 }} >Workout Plans</Text>)
        },
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
