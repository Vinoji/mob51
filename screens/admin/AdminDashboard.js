import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useFetchMobiles } from '../../services/enhancedMobileService';
import { useNavigation } from '@react-navigation/native';

const AdminDashboard = () => {
  const { mobiles, loading } = useFetchMobiles();
  const navigation = useNavigation();

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading mobiles...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mobile Management</Text>
      
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('MobileForm')}
      >
        <Text style={styles.addButtonText}>Add New Mobile</Text>
      </TouchableOpacity>

      <FlatList
        data={mobiles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.mobileItem}
            onPress={() => navigation.navigate('MobileDetails', { mobileId: item.id, isAdmin: true })}
          >
            <Text style={styles.mobileName}>{item.name}</Text>
            <Text style={styles.mobileBrand}>{item.brand}</Text>
            <Text style={styles.mobilePrice}>${item.price}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  mobileItem: {
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
  mobileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  mobileBrand: {
    fontSize: 16,
    color: '#666',
  },
  mobilePrice: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: 'bold',
  },
});

export default AdminDashboard;