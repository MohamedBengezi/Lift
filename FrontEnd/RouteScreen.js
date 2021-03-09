import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { CardStyleInterpolators, createStackNavigator, useHeaderHeight } from "react-navigation-stack";
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
import WorkoutPlansScreen from "./src/screens/Plans/WorkoutPlansScreen";
import ViewPlanScreen from "./src/screens/Plans/ViewPlanScreen";
import CreatePlanScreen from "./src/screens/Plans/CreatePlanScreen";
import AddPlanScreen from "./src/screens/Plans/AddPlanScreen";
import AddWorkoutScreen from "./src/screens/Plans/AddWorkoutScreen";
import AddTestimonialScreen from "./src/screens/Plans/AddTestiomonialScreen";


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


  const FeedStack = createMaterialTopTabNavigator({
    FeedbackFeed: {
      screen: FeedBackScreen,
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

  const MainFlow = createMaterialTopTabNavigator(
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
  );

  const switchNavigator = createSwitchNavigator({
    loading: LoadingScreen,
    loginFlow: createStackNavigator({
      Intro: IntroScreen,
      Signup: SignupScreen,
      Signin: SigninScreen,
    }),
    mainFlow: createStackNavigator(
      {
        Main: {
          screen: MainFlow,
          navigationOptions: {
            headerMode: 'none',
            headerShown: false,
          }
        },
        WorkoutPlans: {
          screen: WorkoutPlansScreen,
          navigationOptions: {
            headerMode: 'none',
            headerShown: false,
            animationEnabled: true,
            cardStyleInterpolator: CardStyleInterpolators.forRevealFromBottomAndroid
          }
        },
        Settings: {
          screen: SettingsScreen,
          navigationOptions: {
            headerMode: 'none',
            headerShown: false,
            animationEnabled: true,
            gestureDirection: 'vertical-inverted',
            cardStyleInterpolator: CardStyleInterpolators.forRevealFromBottomAndroid

          },
        },
        ViewPost: {
          screen: ViewPostScreen,
          navigationOptions: {
            headerMode: 'none',
            headerShown: false,
            animationEnabled: true

          },
        },
        Post: PostScreen,
        ViewPlan: {
          screen: ViewPlanScreen,
          navigationOptions: {
            headerMode: 'none',
            headerTitle: '',
            headerShown: true,
            animationEnabled: true

          },
        },
        ViewProfile: {
          screen: ViewProfileScreen,
          navigationOptions: {
            headerMode: 'none',
            headerTitle: '',
            headerShown: true,
            animationEnabled: true

          },
        },
        CreatePlan: {
          screen: CreatePlanScreen,
          navigationOptions: {
            headerMode: 'none',
            headerTitle: '',
            headerShown: false,
            animationEnabled: true

          },
        },
        AddPlan: {
          screen: AddPlanScreen,
          navigationOptions: {
            headerMode: 'none',
            headerTitle: '',
            headerShown: false,
            animationEnabled: true

          },
        },
        AddTestimonial: {
          screen: AddTestimonialScreen,
          navigationOptions: {
            headerMode: 'none',
            headerTitle: '',
            headerShown: false,
            animationEnabled: true

          },
        },
        AddWorkout: {
          screen: AddWorkoutScreen,
          navigationOptions: {
            headerMode: 'none',
            headerTitle: '',
            headerShown: false,
            animationEnabled: true

          },
        },
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
