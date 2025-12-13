import React from 'react';
import {PaperProvider} from 'react-native-paper';
import {StatusBar} from 'expo-status-bar';
import AppNavigator from './navigation/AppNavigator';
import './global.css';

// NativeWind dark mode is configured as 'class' in tailwind.config.js
// This prevents the error: "Cannot manually set color scheme, as dark mode is type 'media'"

const App = () => {
  return (
    <PaperProvider>
      <StatusBar style="auto" />
      <AppNavigator />
    </PaperProvider>
  );
};

export default App;

