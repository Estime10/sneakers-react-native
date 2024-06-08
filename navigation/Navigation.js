import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import HomeScreen from '../screens/HomeScreen'
import NewPostScreen from '../screens/NewPostScreen'
import LoginScreen from '../screens/LoginScreen'
import SignupScreen from '../screens/SignupScreen'
import ProfileScreen from '../screens/ProfileScreen'
import ModifyProfileScreen from '../screens/ModifyProfileScreen'
import ModifySettingsScreen from '../screens/ModifySettingsScreen'
import ListOfPostScreen from '../screens/ListOfPostScreen'
import NewStoryScreen from '../screens/NewStoryScreen'
import StoryScreen from '../screens/StoryScreen'

const Stack = createStackNavigator()

const screenOptions = {
  headerShown: false,
}

export const SignedInStack = () => (
  <Stack.Navigator
    initialRouteName='StoryScreen'
    screenOptions={screenOptions}>
    <Stack.Screen
      name='HomeScreen'
      component={HomeScreen}
    />
    <Stack.Screen
      name='NewPostScreen'
      component={NewPostScreen}
    />
    <Stack.Screen
      name='ProfileScreen'
      component={ProfileScreen}
    />
    <Stack.Screen
      name='ModifyProfileScreen'
      component={ModifyProfileScreen}
    />
    <Stack.Screen
      name='ModifySettingsScreen'
      component={ModifySettingsScreen}
    />
    <Stack.Screen
      name='ListOfPostScreen'
      component={ListOfPostScreen}
    />
    <Stack.Screen
      name='NewStoryScreen'
      component={NewStoryScreen}
    />
    <Stack.Screen
      name='StoryScreen'
      component={StoryScreen}
    />
  </Stack.Navigator>
)

export const SignedOutStack = () => (
  <Stack.Navigator
    initialRouteName='LoginScreen'
    screenOptions={screenOptions}>
    <Stack.Screen
      name='LoginScreen'
      component={LoginScreen}
    />
    <Stack.Screen
      name='SignupScreen'
      component={SignupScreen}
    />
  </Stack.Navigator>
)
