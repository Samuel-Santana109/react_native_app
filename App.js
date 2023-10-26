import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/components/Navigation'
import { ToastProvider } from 'react-native-toast-notifications'


export default function App() {
  return (
    <ToastProvider>
      <NavigationContainer >
        <AppNavigator />
      </NavigationContainer>
    </ToastProvider>
  );
}