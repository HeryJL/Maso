import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/hooks/useAuth';
import { IncidentProvider } from './src/hooks/useIncidents';
import AppNavigator from './src/navigation/AppNavigator';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Remote debugger']);

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <IncidentProvider>
          <NavigationContainer>
            <StatusBar style="light" backgroundColor="#05130B" />
            <AppNavigator />
          </NavigationContainer>
        </IncidentProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}