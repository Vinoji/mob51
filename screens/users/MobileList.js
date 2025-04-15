import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { categories } from '../../constants/mobileConstants';
import { useFetchMobiles } from '../../services/enhancedMobileService';

const MobileList = () => {
  const { mobiles, loading } = useFetchMobiles();
  const navigation = useNavigation();

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading mobiles...</Text>
      </View>
    );
  }

  const getBrandImage = (brandName) => {
    const brand = categories.find(cat => cat.name === brandName);
    return brand ? brand.image : null;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Mobiles</Text>
      
      <FlatList
        data={mobiles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.mobileItem}
            onPress={() => navigation.navigate('MobileDetails', { mobileId: item.id, isAdmin: false })}
          >
            {item.imageUrl && (
              <Image source={{ uri: item.imageUrl }} style={styles.mobileImage} />
            )}
            
            <View style={styles.mobileInfo}>
              <Text style={styles.mobileName}>{item.name}</Text>
              <View style={styles.brandContainer}>
                {getBrandImage(item.brand) && (
                  <Image source={getBrandImage(item.brand)} style={styles.brandImage} />
                )}
                <Text style={styles.mobileBrand}>{item.brand}</Text>
              </View>
              <Text style={styles.mobilePrice}>${item.price}</Text>
              <Text style={styles.mobileCondition}>{item.condition}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  mobileItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mobileImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  mobileInfo: {
    flex: 1,
    padding: 15,
  },
  mobileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  brandImage: {
    width: 20,
    height: 20,
    marginRight: 5,
    resizeMode: 'contain',
  },
  mobileBrand: {
    fontSize: 16,
    color: '#666',
  },
  mobilePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 5,
  },
  mobileCondition: {
    fontSize: 14,
    color: '#28a745',
    fontWeight: 'bold',
  },
});

export default MobileList;