import React from 'react'
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Header from './src/components/Header';
import HeaderLeft from './src/components/HeaderLeft';
import HeaderRight from './src/components/HeaderRight';
import MainScreen from './src/screens/MainScreen';
import ChatScreen from './src/screens/ChatScreen';
import HomeScreen from './src/screens/HomeScreen';
import CreateScreen from './src/screens/CreateScreen';
import { Provider } from './src/components/context/CreateContext';

const navigator = createStackNavigator(
  {
    Main: MainScreen,
    Feed: HomeScreen,
    Profile: ChatScreen,
    Create: CreateScreen
  },
  {
    initialRouteName: 'Main',
    defaultNavigationOptions: ({ navigation }) => {
      return {
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerTitle: () => (<Header onPress={() => navigation.navigate('Main')} />),
        headerLeft: () => (<HeaderLeft onPress={() => navigation.navigate('Feed')} />),
        headerRight: () => (<HeaderRight onPress={() => navigation.navigate('Profile')} />)
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
