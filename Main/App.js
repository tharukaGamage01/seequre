import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ChangePassword } from './Screens/Profile/ChangePassword';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import UrlHistory from './Screens/URLHistory/URLHistoryScreen';
import Login from './Screens/Login/LoginScreen';
import Scanner from './Screens/Scanner/ScannerPage';
import RegisterPage from './Screens/Register/RegisterPage';
import { ProfilePage } from './Screens/Profile/ProfilePage';
import FeedbackPage from './Screens/Profile/FeedbackPage';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const ProfileStack = () => (
  <Stack.Navigator initialRouteName='profile page' screenOptions={{ headerShown: false }}>
    <Stack.Screen name="profile page" component={ProfilePage} />
    <Stack.Screen name="changePassword" component={ChangePassword} />
    <Stack.Screen name="feedback" component={FeedbackPage} />
  </Stack.Navigator>
);

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" component={Login} />
        <Stack.Screen name="register" component={RegisterPage} />
        <Stack.Screen name="main" component={MainTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const MainTabNavigator = () => (
  <Tab.Navigator
    initialRouteName="scanner" 
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'scanner') {
          iconName = 'line-scan';
        } else if (route.name === 'profile') {
          iconName = 'account';
        } else if (route.name === 'urlHistory') {
          iconName = 'history';
        }

        return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="urlHistory" component={UrlHistory} options={{headerShown:false}} />
    <Tab.Screen name="scanner" component={Scanner}  options={{headerShown:false}}  />
    <Tab.Screen name="profile" component={ProfileStack}  options={{headerShown:false}} />
  </Tab.Navigator>
);

export default App;
