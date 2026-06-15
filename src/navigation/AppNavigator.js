import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { useIncidents } from '../hooks/useIncidents';
import { colors } from '../utils/colors';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import MapScreen from '../screens/map/MapScreen';
import IncidentListScreen from '../screens/incidents/IncidentListScreen';
import ReportScreen from '../screens/report/ReportScreen';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import IncidentDetailScreen from '../screens/incidents/IncidentDetailScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

const screenOptions = {
  headerStyle: { backgroundColor: colors.dark },
  headerTintColor: colors.background,
  headerTitleStyle: { fontWeight: 'bold' },
};

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Map" component={MapScreen} options={{ title: 'Carte des incidents' }} />
      <Stack.Screen name="IncidentDetail" component={IncidentDetailScreen} options={{ title: 'Détail' }} />
    </Stack.Navigator>
  );
}

function ListStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="IncidentList" component={IncidentListScreen} options={{ title: 'Signalements' }} />
      <Stack.Screen name="IncidentDetail" component={IncidentDetailScreen} options={{ title: 'Détail' }} />
    </Stack.Navigator>
  );
}

function ReportStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Report" component={ReportScreen} options={{ title: 'Nouveau signalement' }} />
    </Stack.Navigator>
  );
}

function NotificationsStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notifications' }} />
      <Stack.Screen name="IncidentDetail" component={IncidentDetailScreen} options={{ title: 'Détail' }} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Mon profil' }} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  const { unreadCount } = useIncidents();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'HomeTab': iconName = focused ? 'map' : 'map-outline'; break;
            case 'ListTab': iconName = focused ? 'list' : 'list-outline'; break;
            case 'ReportTab': iconName = focused ? 'add-circle' : 'add-circle-outline'; break;
            case 'NotificationsTab': iconName = focused ? 'notifications' : 'notifications-outline'; break;
            case 'ProfileTab': iconName = focused ? 'person' : 'person-outline'; break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.dark,
          borderTopColor: colors.border,
          paddingBottom: 5, paddingTop: 5,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Carte' }} />
      <Tab.Screen name="ListTab" component={ListStack} options={{ title: 'Liste' }} />
      <Tab.Screen name="ReportTab" component={ReportStack} options={{ title: 'Signaler' }} />
      <Tab.Screen name="NotificationsTab" component={NotificationsStack} options={{ 
        title: 'Alertes',
        tabBarBadge: unreadCount > 0 ? unreadCount : null,
        tabBarBadgeStyle: { backgroundColor: colors.primary }
      }} />
      <Tab.Screen name="ProfileTab" component={ProfileStack} options={{ title: 'Profil' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user } = useAuth();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="Main" component={MainTabs} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}