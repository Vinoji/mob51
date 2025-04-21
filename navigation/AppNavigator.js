// navigation/AppNavigator.js
import React, { useContext } from 'react';
import { TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Expo
import MobileList from '../screens/users/MobileList';
import MobileDetailsWithReviews from '../screens/users/MobileDetailsWithReviews';
import SearchMobiles from '../screens/users/SearchMobiles';
import Favorites from '../screens/users/Favorites';
import AdminDashboard from '../screens/admin/AdminDashboard';
import MobileForm from '../screens/admin/MobileForm';
import MobileDetails from '../screens/admin/MobileDetails';
import { AuthContext } from '../contexts/AuthContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// User navigation stack
function UserStack() {
  const { logout } = useContext(AuthContext);
  
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MobileList" 
        component={MobileList} 
        options={({ navigation }) => ({
          title: 'Mobiles',
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 15 }}
              onPress={logout}
            >
              <Ionicons name="log-out-outline" size={24} color="#0066cc" />
            </TouchableOpacity>
          )
        })}
      />
      <Stack.Screen
        name="MobileDetails"
        component={MobileDetailsWithReviews}
        options={({ route }) => ({ title: route.params.mobileName || 'Mobile Details' })}
      />
      <Stack.Screen name="SearchMobiles" component={SearchMobiles} options={{ title: 'Search' }} />
    </Stack.Navigator>
  );
}

// Favorites navigation stack
function FavoritesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="UserFavorites" component={Favorites} options={{ title: 'My Favorites' }} />
      <Stack.Screen
        name="MobileDetails"
        component={MobileDetailsWithReviews}
        options={({ route }) => ({ title: route.params.mobileName || 'Mobile Details' })}
      />
    </Stack.Navigator>
  );
}

// Admin navigation stack
function AdminStack() {
  const { logout } = useContext(AuthContext);
  
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="AdminDashboard" 
        component={AdminDashboard} 
        options={{
          title: 'Mobile Management',
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 15 }}
              onPress={logout}
            >
              <Ionicons name="log-out-outline" size={24} color="#0066cc" />
            </TouchableOpacity>
          )
        }}
      />
      <Stack.Screen name="MobileForm" component={MobileForm} options={{ title: 'Add/Edit Mobile' }} />
      <Stack.Screen
        name="MobileDetails"
        component={MobileDetails}
        options={({ route }) => ({ title: route.params.mobileName || 'Mobile Details' })}
      />
    </Stack.Navigator>
  );
}

// Main app navigation with tabs
export default function AppNavigator({ isAdmin }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Admin') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      {isAdmin ? (
        <Tab.Screen name="Admin" component={AdminStack} />
      ) : (
        <>
          <Tab.Screen name="Home" component={UserStack} />
          <Tab.Screen name="Search" component={SearchMobiles} />
          <Tab.Screen name="Favorites" component={FavoritesStack} />
        </>
      )}
    </Tab.Navigator>
  );
}