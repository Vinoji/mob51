import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity ,Image} from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { searchMobiles, filterMobiles } from '../../services/enhancedMobileService';
import { useNavigation } from '@react-navigation/native';
import { categories, screenSizes, batteryCapacities, cameraQualities, ramSizes, storageSizes, conditions } from '../../constants/mobileConstants';

const SearchMobiles = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [filters, setFilters] = useState({
    brand: '',
    minPrice: '',
    maxPrice: '',
    screenSize: '',
    batteryCapacity: '',
    cameraQuality: '',
    ramSize: '',
    storageSize: '',
    condition: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const navigation = useNavigation();

  const handleSearch = async () => {
    try {
      if (searchTerm) {
        const searchResults = await searchMobiles(searchTerm);
        setResults(searchResults);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('Error searching mobiles:', error);
    }
  };

  const handleFilter = async () => {
    try {
      const filteredResults = await filterMobiles(filters);
      setResults(filteredResults);
    } catch (error) {
      console.error('Error filtering mobiles:', error);
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    setFilters({
      brand: '',
      minPrice: '',
      maxPrice: '',
      screenSize: '',
      batteryCapacity: '',
      cameraQuality: '',
      ramSize: '',
      storageSize: '',
      condition: '',
    });
    setResults([]);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search mobiles by name, brand or description..."
        value={searchTerm}
        onChangeText={setSearchTerm}
        onSubmitEditing={handleSearch}
      />

      <TouchableOpacity 
        style={styles.filterToggle}
        onPress={() => setShowFilters(!showFilters)}
      >
        <Text style={styles.filterToggleText}>
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Text>
      </TouchableOpacity>

      {showFilters && (
        <View style={styles.filterContainer}>
          <Text style={styles.filterTitle}>Filter By:</Text>
          
          <Text style={styles.filterLabel}>Brand</Text>
          <Picker
            selectedValue={filters.brand}
            style={styles.filterPicker}
            onValueChange={(itemValue) => setFilters({ ...filters, brand: itemValue })}
          >
            <Picker.Item label="All Brands" value="" />
            {categories.map((category) => (
              <Picker.Item key={category.id} label={category.name} value={category.name} />
            ))}
          </Picker>

          <View style={styles.priceRangeContainer}>
            <View style={styles.priceInputContainer}>
              <Text style={styles.filterLabel}>Min Price</Text>
              <TextInput
                style={styles.priceInput}
                placeholder="$0"
                value={filters.minPrice}
                onChangeText={(text) => setFilters({ ...filters, minPrice: text })}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.priceInputContainer}>
              <Text style={styles.filterLabel}>Max Price</Text>
              <TextInput
                style={styles.priceInput}
                placeholder="$1000"
                value={filters.maxPrice}
                onChangeText={(text) => setFilters({ ...filters, maxPrice: text })}
                keyboardType="numeric"
              />
            </View>
          </View>

          <Text style={styles.filterLabel}>Screen Size</Text>
          <Picker
            selectedValue={filters.screenSize}
            style={styles.filterPicker}
            onValueChange={(itemValue) => setFilters({ ...filters, screenSize: itemValue })}
          >
            <Picker.Item label="Any Screen Size" value="" />
            {screenSizes.map((size) => (
              <Picker.Item key={size} label={size} value={size} />
            ))}
          </Picker>

          <Text style={styles.filterLabel}>Battery Capacity</Text>
          <Picker
            selectedValue={filters.batteryCapacity}
            style={styles.filterPicker}
            onValueChange={(itemValue) => setFilters({ ...filters, batteryCapacity: itemValue })}
          >
            <Picker.Item label="Any Battery" value="" />
            {batteryCapacities.map((capacity) => (
              <Picker.Item key={capacity} label={capacity} value={capacity} />
            ))}
          </Picker>

          <Text style={styles.filterLabel}>Condition</Text>
          <Picker
            selectedValue={filters.condition}
            style={styles.filterPicker}
            onValueChange={(itemValue) => setFilters({ ...filters, condition: itemValue })}
          >
            <Picker.Item label="Any Condition" value="" />
            {conditions.map((condition) => (
              <Picker.Item key={condition} label={condition} value={condition} />
            ))}
          </Picker>

          <View style={styles.filterButtons}>
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={handleFilter}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={handleReset}
            >
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.resultItem}
            onPress={() => navigation.navigate('MobileDetails', { mobileId: item.id, isAdmin: false })}
          >
            <Text style={styles.resultName}>{item.name}</Text>
            <Text style={styles.resultBrand}>{item.brand}</Text>
            <Text style={styles.resultPrice}>${item.price}</Text>
            {item.imageUrl && (
              <Image source={{ uri: item.imageUrl }} style={styles.resultImage} />
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.noResults}>No mobiles found. Try a different search or filter.</Text>
        }
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
  searchInput: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterToggle: {
    backgroundColor: '#6c757d',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    alignItems: 'center',
  },
  filterToggleText: {
    color: 'white',
    fontWeight: 'bold',
  },
  filterContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  filterLabel: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  filterPicker: {
    backgroundColor: '#f8f9fa',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  priceRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceInputContainer: {
    width: '48%',
  },
  priceInput: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  applyButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  resetButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  resultItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  resultName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  resultBrand: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  resultPrice: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultImage: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
    borderRadius: 5,
  },
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});

export default SearchMobiles;