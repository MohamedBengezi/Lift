import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createMaterialTopTabNavigator } from "react-navigation-tabs";
import { StyleSheet, Text } from "react-native";
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
import { Provider as AuthProvider } from "./src/context/AuthContext";
import { setNavigator } from "./src/navigationRef";
import HeaderLeft from "./src/components/HeaderLeft";
import { SafeAreaProvider, useSafeArea } from "react-native-safe-area-context";
import RouteScreen from "./RouteScreen";
//const Tab = createMaterialTopTabNavigator();
const styleTab = {
  activeTintColor: "red",
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
  activeTintColor: "red",
  labelStyle: {
    fontSize: 15,
  },
  showLabel: true,
  tabStyle: {
    height: 50,
    marginTop: 0,
    fontSize: 10,
    backgroundColor: "#fff",
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
});

const FeedStack = createMaterialTopTabNavigator({
  MainFeed: {
    screen: FeedScreen,
    navigationOptions: {
      tabBarVisible: true,
      tabBarLabel: "Posts",
      tabBarOptions: feedStyleTab,
      swipeEnabled: false,
    },
  },
  FeedTwo: {
    screen: FeedTwo,
    navigationOptions: {
      tabBarVisible: true,
      tabBarLabel: "Diet Plans",
      tabBarOptions: feedStyleTab,
      swipeEnabled: false,
    },
  },
  FeedThree: {
    screen: FeedThree,
    navigationOptions: {
      tabBarVisible: true,
      tabBarLabel: "Workout Plans",
      tabBarOptions: feedStyleTab,
      swipeEnabled: false,
    },
  },
});

const switchNavigator = createSwitchNavigator({
  loginFlow: createStackNavigator({
    Intro: IntroScreen,
    Signup: SignupScreen,
    Signin: SigninScreen,
  }),
  makePostFlow: createStackNavigator(
    {
      Post: PostScreen,
    },
    {
      defaultNavigationOptions: ({ navigation }) => {
        return {
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerLeft: () => (
            <HeaderLeft onPress={() => navigation.navigate("Main")} />
          ),
        };
      },
    }
  ),
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

export default () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RouteScreen />
      </AuthProvider>
    </SafeAreaProvider>
  );
};
