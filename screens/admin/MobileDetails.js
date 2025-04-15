import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { getMobileById, deleteMobile } from '../../services/enhancedMobileService';
import { useNavigation } from '@react-navigation/native';

const MobileDetails = ({ route }) => {
  const { mobileId, isAdmin } = route.params;
  const [mobile, setMobile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const loadMobile = async () => {
      try {
        const mobileData = await getMobileById(mobileId);
        setMobile(mobileData);
      } catch (error) {
        console.error('Error loading mobile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMobile();
  }, [mobileId]);

  const handleDelete = () => {
    Alert.alert(
      'Delete Mobile',
      'Are you sure you want to delete this mobile?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMobile(mobileId);
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting mobile:', error);
              Alert.alert('Error', 'Failed to delete mobile');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading mobile details...</Text>
      </View>
    );
  }

  if (!mobile) {
    return (
      <View style={styles.container}>
        <Text>Mobile not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {mobile.imageUrl && (
        <Image source={{ uri: mobile.imageUrl }} style={styles.image} />
      )}

      <View style={styles.header}>
        <Text style={styles.name}>{mobile.name}</Text>
        <Text style={styles.brand}>{mobile.brand}</Text>
        <Text style={styles.price}>${mobile.price}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{mobile.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Specifications</Text>
        <View style={styles.specRow}>
          <Text style={styles.specLabel}>Screen Size:</Text>
          <Text style={styles.specValue}>{mobile.screenSize || 'N/A'}</Text>
        </View>
        <View style={styles.specRow}>
          <Text style={styles.specLabel}>Battery:</Text>
          <Text style={styles.specValue}>{mobile.batteryCapacity || 'N/A'}</Text>
        </View>
        <View style={styles.specRow}>
          <Text style={styles.specLabel}>Camera:</Text>
          <Text style={styles.specValue}>{mobile.cameraQuality || 'N/A'}</Text>
        </View>
        <View style={styles.specRow}>
          <Text style={styles.specLabel}>RAM:</Text>
          <Text style={styles.specValue}>{mobile.ramSize || 'N/A'}</Text>
        </View>
        <View style={styles.specRow}>
          <Text style={styles.specLabel}>Storage:</Text>
          <Text style={styles.specValue}>{mobile.storageSize || 'N/A'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Condition</Text>
        <Text style={styles.condition}>{mobile.condition}</Text>
        {mobile.conditionDetails && (
          <>
            <Text style={styles.conditionDetail}>{mobile.conditionDetails.description1}</Text>
            <Text style={styles.conditionDetail}>{mobile.conditionDetails.description2}</Text>
            <Text style={styles.conditionDetail}>{mobile.conditionDetails.description3}</Text>
            <Text style={styles.conditionDetail}>{mobile.conditionDetails.description4}</Text>
          </>
        )}
      </View>

      {isAdmin && (
        <View style={styles.adminActions}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => navigation.navigate('MobileForm', { mobileId })}
          >
            <Text style={styles.editButtonText}>Edit Mobile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <Text style={styles.deleteButtonText}>Delete Mobile</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'contain',
    marginBottom: 20,
    borderRadius: 10,
  },
  header: {
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  brand: {
    fontSize: 18,
    color: '#666',
    marginBottom: 5,
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007bff',
  },
  section: {
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  specLabel: {
    fontWeight: 'bold',
    color: '#555',
  },
  specValue: {
    color: '#333',
  },
  condition: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  conditionDetail: {
    fontSize: 14,
    marginBottom: 3,
    color: '#555',
  },
  adminActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  editButton: {
    backgroundColor: '#ffc107',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#212529',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MobileDetails;