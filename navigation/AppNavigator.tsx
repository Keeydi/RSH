import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../components/HomeScreen';
import MapScreen from '../components/MapScreen';
import HotlinesScreen from '../components/HotlinesScreen';
import FOCUSScreen from '../components/FOCUSScreen';
import LearnScreen from '../components/LearnScreen';
import ProfileScreen from '../components/ProfileScreen';
import LoginScreen from '../components/LoginScreen';
import EmergencyContactsScreen from '../components/EmergencyContactsScreen';
import {HomeIcon, MapIcon, PhoneIcon, FocusIcon, LearnIcon, UserIcon} from '../components/Icons';
import {authHelpers, supabase} from '../config/supabase';
import {theme} from '../config/theme';

export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  EmergencyContacts: undefined;
};

export type TabParamList = {
  Home: undefined;
  Map: undefined;
  Hotlines: undefined;
  FOCUS: undefined;
  Learn: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

interface TabNavigatorProps {
  onLogout: () => void;
}

const TabNavigator = ({onLogout}: TabNavigatorProps) => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E7EB',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: theme.primary.main, // Logo orange-red
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({color}) => (
            <HomeIcon color={color} size={22} />
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarIcon: ({color}) => (
            <MapIcon color={color} size={22} />
          ),
        }}
      />
      <Tab.Screen
        name="Hotlines"
        component={HotlinesScreen}
        options={{
          tabBarIcon: ({color}) => (
            <PhoneIcon color={color} size={22} />
          ),
        }}
      />
      <Tab.Screen
        name="FOCUS"
        component={FOCUSScreen}
        options={{
          tabBarLabel: 'F.O.C.U.S.',
          tabBarIcon: ({color}) => (
            <FocusIcon color={color} size={22} />
          ),
        }}
      />
      <Tab.Screen
        name="Learn"
        component={LearnScreen}
        options={{
          tabBarIcon: ({color}) => (
            <LearnIcon color={color} size={22} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        options={{
          tabBarIcon: ({color}) => (
            <UserIcon color={color} size={22} />
          ),
        }}>
        {props => <ProfileScreen {...props} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  // Check for existing session on app start
  useEffect(() => {
    checkSession();
    
    // Listen for auth state changes
    const {data: {subscription}} = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const checkSession = async () => {
    try {
      const {session} = await authHelpers.getSession();
      setIsLoggedIn(!!session);
    } catch (error) {
      console.error('Error checking session:', error);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    try {
      await authHelpers.signOut();
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggedIn(false);
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {!isLoggedIn ? (
          <Stack.Screen name="Login">
            {props => <LoginScreen {...props} onLogin={handleLogin} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="MainTabs">
              {props => <TabNavigator {...props} onLogout={handleLogout} />}
            </Stack.Screen>
            <Stack.Screen 
              name="EmergencyContacts" 
              component={EmergencyContactsScreen}
              options={{
                headerShown: false,
                presentation: 'card',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
