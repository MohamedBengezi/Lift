import React from 'react'
import { createAppContainer } from 'react-navigation';
import { createStackNavigator, TransitionPresets } from 'react-navigation-stack';
import Header from './src/components/Header';
import HeaderLeft from './src/components/HeaderLeft';
import HeaderRight from './src/components/HeaderRight';
import MainScreen from './src/screens/MainScreen';
import ChatScreen from './src/screens/ChatScreen';
import HomeScreen from './src/screens/HomeScreen';
import { Provider } from './src/components/context/CreateContext';

const navigator = createStackNavigator(
  {
    Main: {
      screen: MainScreen,
      navigationOptions: ({ navigation }) => ({
        ...TransitionPresets.ModalSlideFromBottomIOS,
      }),
    },
    Feed: {
      screen: HomeScreen,
      navigationOptions: ({ navigation }) => ({
        ...TransitionPresets.ModalSlideFromBottomIOS,
      }),
    },
    Profile: {
      screen: ChatScreen,
      navigationOptions: ({ navigation }) => ({
        ...TransitionPresets.ModalSlideFromBottomIOS,
      }),
    }
  },
  {
    initialRouteName: 'Main',
    defaultNavigationOptions: ({ navigation }) => {
      return {
        headerStyle: {
          backgroundColor: '#ffffff',
        },
      }
    }
  }
);
const App = createAppContainer(navigator);
export default () => {
  return <Provider>
    <App />
  </Provider>
};
