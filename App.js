import React from 'react'
import { StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MainScreen from './src/screens/MainScreen';
import ProfileScreen from './src/screens/ProfileIndex';
import HomeScreen from './src/screens/HomeScreen';

const Tab = createMaterialTopTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Feed') {
              iconName = focused
                ? 'ios-information-circle'
                : 'ios-information-circle-outline';
            } else if (route.name === 'Main') {
              iconName = focused ? 'md-camera' : 'md-camera';
            } else {
              iconName = focused ? 'md-person' : 'md-person';
            }

            return <Ionicons name={iconName} size={size} color={color} style={styles.container} />;
          },
        })}
        tabBarPosition='bottom'
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
          showIcon: true,
          showLabel: false,
          style: {
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0
          }
        }}
        initialRouteName={'Main'}
      >
        <Tab.Screen name="Feed" component={HomeScreen} />
        <Tab.Screen name="Main" component={MainScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontSize: 24,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  }
});