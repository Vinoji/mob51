// screens/users/Favorites.js
import React, { useContext } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  Image, 
  TouchableOpacity 
} from 'react-native';
import { useFetchUserFavorites } from '../../services/enhancedMobileService';
import { AuthContext } from '../../contexts/AuthContext';

const Favorites = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const { favorites, loading } = useFetchUserFavorites(user?.uid);

  const handleMobilePress = (mobile) => {
    navigation.navigate('MobileDetails', { 
      mobileId: mobile.id,
      mobileName: mobile.name
    });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.noFavoritesText}>No favorite mobiles yet.</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Home')} // Changed from 'MobileList' to 'Home'
        >
          <Text style={styles.buttonText}>Browse Mobiles</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderMobileItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.mobileItem}
      onPress={() => handleMobilePress(item)}
    >
      <Image 
        source={{ uri: item.image }} 
        style={styles.mobileImage}
      />
      <View style={styles.mobileInfo}>
        <Text style={styles.mobileName}>{item.name}</Text>
        <Text style={styles.mobileBrand}>{item.brand}</Text>
        <Text style={styles.mobilePrice}>${item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        renderItem={renderMobileItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  list: {
    padding: 16,
  },
  mobileItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  mobileImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  mobileInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  mobileName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  mobileBrand: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  mobilePrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0066cc',
  },
  noFavoritesText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default Favorites;