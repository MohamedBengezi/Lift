import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createMaterialTopTabNavigator } from "react-navigation-tabs";
import { StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MainScreen from "./src/screens/MainScreen";
import ProfileScreen from "./src/screens/ProfileIndex";
import FeedScreen from "./src/screens/FeedScreen";
import FeedTwo from "./src/screens/Feeds/FeedTwo";
import FeedThree from "./src/screens/Feeds/FeedThree";
import SigninScreen from "./src/screens/SigninScreen";
import SignupScreen from "./src/screens/SignupScreen";
import PostScreen from './src/screens/PostScreen';
import { Provider as AuthProvider } from "./src/context/AuthContext";
import { setNavigator } from "./src/navigationRef";
import HeaderLeft from './src/components/HeaderLeft';

//const Tab = createMaterialTopTabNavigator();
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
  style: {},
  activeTintColor: "red",
  tabStyle: {
    height: 40,
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
  feed: {
    flex: 1,
    fontSize: 15,
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
      tabBarLabel: "FeedOne",
      tabBarOptions: feedStyleTab,
      swipeEnabled: false,
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        let iconName = `md-fitness`;
        return (
          <Ionicons
            name={iconName}
            size={horizontal ? 20 : 25}
            color={tintColor}
            style={styles.feed}
          />
        );
      },
    },
  },
  FeedTwo: {
    screen: FeedTwo,
    navigationOptions: {
      tabBarVisible: true,
      tabBarLabel: "FeedTwo",
      tabBarOptions: feedStyleTab,
      swipeEnabled: false,
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        let iconName = `md-water`;
        return (
          <Ionicons
            name={iconName}
            size={horizontal ? 20 : 25}
            color={tintColor}
            style={styles.feed}
          />
        );
      },
    },
  },
  FeedThree: {
    screen: FeedThree,
    navigationOptions: {
      tabBarVisible: true,
      tabBarLabel: "FeedThree",
      tabBarOptions: feedStyleTab,
      swipeEnabled: false,
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        let iconName = `md-hammer`;
        return (
          <Ionicons
            name={iconName}
            size={horizontal ? 20 : 25}
            color={tintColor}
            style={styles.feed}
          />
        );
      },
    },
  }
})

const switchNavigator = createSwitchNavigator({
  loginFlow: createStackNavigator({
    Signup: SignupScreen,
    Signin: SigninScreen
  }),
  makePostFlow: createStackNavigator({
    Post: PostScreen
  }, {
    defaultNavigationOptions: ({ navigation }) => {
      return {
        headerStyle: {
          backgroundColor: 'transparent',
        },
        headerLeft: () => (<HeaderLeft onPress={() => navigation.navigate('Main')} />),
      }
    }
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

export default () => {
  return (
    <AuthProvider>
      <App
        ref={(navigator) => {
          setNavigator(navigator);
        }}
      />
    </AuthProvider>
  );
};