// navigation/AppNavigator.js
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MobileList from '../screens/users/MobileList';
import MobileDetailsWithReviews from '../screens/users/MobileDetailsWithReviews';
import SearchMobiles from '../screens/users/SearchMobiles';
import AdminDashboard from '../screens/admin/AdminDashboard';
import MobileForm from '../screens/admin/MobileForm';
import MobileDetails from '../screens/admin/MobileDetails';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// User navigation stack
function UserStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MobileList" component={MobileList} options={{ title: 'Mobiles' }} />
      <Stack.Screen 
        name="MobileDetails" 
        component={MobileDetailsWithReviews} 
        options={({ route }) => ({ title: route.params.mobileName || 'Mobile Details' })}
      />
      <Stack.Screen name="SearchMobiles" component={SearchMobiles} options={{ title: 'Search' }} />
    </Stack.Navigator>
  );
}

// Admin navigation stack
function AdminStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{ title: 'Mobile Management' }} />
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
    <Tab.Navigator>
      {isAdmin ? (
        <Tab.Screen name="Admin" component={AdminStack} />
      ) : (
        <>
          <Tab.Screen name="Home" component={UserStack} />
          <Tab.Screen name="Search" component={SearchMobiles} />
        </>
      )}
    </Tab.Navigator>
  );
}