import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { categories } from '../../constants/mobileConstants';
import { useFetchMobiles, useTodayDeals, useBestSelling } from '../../services/enhancedMobileService';

const MobileList = () => {
  const { mobiles, loading } = useFetchMobiles();
  const { mobiles: todayDeals, loading: todayDealsLoading } = useTodayDeals();
  const { mobiles: bestSelling, loading: bestSellingLoading } = useBestSelling();
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState(null);

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

  const filteredMobiles = selectedCategory
    ? mobiles.filter((item) => item.brand === selectedCategory)
    : mobiles;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Mobiles</Text>

      {/* CATEGORY FILTER LIST */}
      <FlatList
        horizontal
        data={categories}
        keyExtractor={(item) => item.name}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryItem,
              selectedCategory === item.name && styles.selectedCategory,
            ]}
            onPress={() =>
              setSelectedCategory((prev) => (prev === item.name ? null : item.name))
            }
          >
            <Image source={item.image} style={styles.categoryImage} />
            <Text style={styles.categoryName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Today's Deals Section */}
      <Text style={styles.sectionTitle}>🔥 Today's Deals</Text>
      {todayDealsLoading ? (
        <ActivityIndicator size="small" color="#0000ff" />
      ) : (
        <FlatList
          horizontal
          data={todayDeals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.featuredItem}
              onPress={() => navigation.navigate('MobileDetails', { mobileId: item.id })}
            >
              {item.imageUrl && (
                <Image source={{ uri: item.imageUrl }} style={styles.featuredImage} />
              )}
              <View style={styles.featuredBadge}>
                <Text style={styles.featuredBadgeText}>DEAL</Text>
              </View>
              <Text style={styles.featuredName}>{item.name}</Text>
              <Text style={styles.featuredPrice}>${item.price}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.noFeatured}>No today's deals available</Text>
          }
        />
      )}

      {/* Best Selling Section */}
      <Text style={styles.sectionTitle}>⭐ Best Selling</Text>
      {bestSellingLoading ? (
        <ActivityIndicator size="small" color="#0000ff" />
      ) : (
        <FlatList
          horizontal
          data={bestSelling}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.featuredItem}
              onPress={() => navigation.navigate('MobileDetails', { mobileId: item.id })}
            >
              {item.imageUrl && (
                <Image source={{ uri: item.imageUrl }} style={styles.featuredImage} />
              )}
              <View style={[styles.featuredBadge, styles.bestSellerBadge]}>
                <Text style={styles.featuredBadgeText}>BEST</Text>
              </View>
              <Text style={styles.featuredName}>{item.name}</Text>
              <Text style={styles.featuredPrice}>${item.price}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.noFeatured}>No best selling mobiles available</Text>
          }
        />
      )}

      {/* Main Mobile List */}
      {filteredMobiles.length === 0 ? (
        <Text style={styles.noResults}>No mobiles found in this category.</Text>
      ) : (
        <Text style={styles.sectionTitle}>All Mobiles</Text>
      )}
      {filteredMobiles.length > 0 && (
        <FlatList
          data={filteredMobiles}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.mobileItem}
              onPress={() =>
                navigation.navigate('MobileDetails', {
                  mobileId: item.id,
                  isAdmin: false,
                })
              }
            >
              {item.imageUrl && (
                <Image source={{ uri: item.imageUrl }} style={styles.mobileImage} />
              )}
              <View style={styles.mobileInfo}>
                <Text style={styles.mobileName}>{item.name}</Text>
                <View style={styles.brandContainer}>
                  {getBrandImage(item.brand) && (
                    <Image
                      source={getBrandImage(item.brand)}
                      style={styles.brandImage}
                    />
                  )}
                  <Text style={styles.mobileBrand}>{item.brand}</Text>
                </View>
                <Text style={styles.mobilePrice}>${item.price}</Text>
                <Text style={styles.mobileCondition}>{item.condition}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
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
  categoryList: {
    paddingBottom: 10,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 15,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  selectedCategory: {
    backgroundColor: '#007bff20',
    borderColor: '#007bff',
    borderWidth: 1,
  },
  categoryImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  categoryName: {
    fontSize: 14,
    color: '#333',
  },
  noResults: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  featuredItem: {
    width: 180,
    marginRight: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    position: 'relative',
  },
  featuredImage: {
    width: '100%',
    height: 120,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  featuredBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FF5722',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  bestSellerBadge: {
    backgroundColor: '#4CAF50',
  },
  featuredBadgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  featuredName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  featuredPrice: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: 'bold',
  },
  noFeatured: {
    padding: 15,
    color: '#666',
    textAlign: 'center',
  },
});

export default MobileList;