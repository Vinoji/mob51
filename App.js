// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import AuthNavigator from './navigation/AuthNavigator';
import AppNavigator from './navigation/AppNavigator';
import LoadingIndicator from './components/LoadingIndicator';

// Main app component
const Main = () => {
  // Use the auth context to determine which navigator to show
  const { user, isAdmin, loading } = React.useContext(AuthContext);

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <NavigationContainer>
      {user ? <AppNavigator isAdmin={isAdmin} /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

// Root component with providers
export default function App() {
  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  );
}