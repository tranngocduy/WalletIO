import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';

import { Dashboard } from '@/screens/Dashboard';
import { ChartPrice } from '@/screens/ChartPrice';

const Stack = createNativeStackNavigator();

const stackOptions: NativeStackNavigationOptions = { headerShown: false, animation: 'slide_from_right', contentStyle: { backgroundColor: '#FFFFFF' } };

const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={stackOptions}>
      <Stack.Screen name='Dashboard' component={Dashboard} />
      <Stack.Screen name='ChartPrice' component={ChartPrice} />
    </Stack.Navigator>
  )
}

const AppNavigator = () => {

  return <NavigationContainer><AppStack /></NavigationContainer>;

}

export default AppNavigator;
