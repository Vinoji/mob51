import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { addMobile, updateMobile, getMobileById } from '../../services/enhancedMobileService';
import { categories, screenSizes, batteryCapacities, cameraQualities, ramSizes, storageSizes, conditions, mobileConditions } from '../../constants/mobileConstants';

const MobileForm = ({ route, navigation }) => {
  const { mobileId } = route.params || {};
  const [mobile, setMobile] = useState({
    name: '',
    brand: 'Apple',
    price: '',
    description: '',
    screenSize: '',
    batteryCapacity: '',
    cameraQuality: '',
    ramSize: '',
    storageSize: '',
    condition: 'New',
    conditionDetails: null,
  });
  const [imageUri, setImageUri] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (mobileId) {
      setIsEditing(true);
      loadMobileData();
    }
  }, [mobileId]);

  const loadMobileData = async () => {
    try {
      setIsLoading(true);
      const mobileData = await getMobileById(mobileId);
      setMobile(mobileData);
      if (mobileData.imageUrl) {
        setImageUri(mobileData.imageUrl);
      }
    } catch (error) {
      console.error('Error loading mobile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      if (isEditing) {
        await updateMobile(mobileId, mobile, imageUri);
      } else {
        await addMobile(mobile, imageUri);
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error saving mobile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setMobile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{isEditing ? 'Edit Mobile' : 'Add New Mobile'}</Text>

      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.image} />
      )}
      
      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.imageButtonText}>{imageUri ? 'Change Image' : 'Select Image'}</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Mobile Name"
        value={mobile.name}
        onChangeText={(text) => handleChange('name', text)}
      />

      <Text style={styles.label}>Brand</Text>
      <Picker
        selectedValue={mobile.brand}
        style={styles.picker}
        onValueChange={(itemValue) => handleChange('brand', itemValue)}
      >
        {categories.map((category) => (
          <Picker.Item key={category.id} label={category.name} value={category.name} />
        ))}
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Price"
        value={mobile.price}
        onChangeText={(text) => handleChange('price', text)}
        keyboardType="numeric"
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description"
        value={mobile.description}
        onChangeText={(text) => handleChange('description', text)}
        multiline
        numberOfLines={4}
      />

      <Text style={styles.sectionTitle}>Specifications</Text>

      <Text style={styles.label}>Screen Size</Text>
      <Picker
        selectedValue={mobile.screenSize}
        style={styles.picker}
        onValueChange={(itemValue) => handleChange('screenSize', itemValue)}
      >
        <Picker.Item label="Select Screen Size" value="" />
        {screenSizes.map((size) => (
          <Picker.Item key={size} label={size} value={size} />
        ))}
      </Picker>

      <Text style={styles.label}>Battery Capacity</Text>
      <Picker
        selectedValue={mobile.batteryCapacity}
        style={styles.picker}
        onValueChange={(itemValue) => handleChange('batteryCapacity', itemValue)}
      >
        <Picker.Item label="Select Battery Capacity" value="" />
        {batteryCapacities.map((capacity) => (
          <Picker.Item key={capacity} label={capacity} value={capacity} />
        ))}
      </Picker>

      <Text style={styles.label}>Camera Quality</Text>
      <Picker
        selectedValue={mobile.cameraQuality}
        style={styles.picker}
        onValueChange={(itemValue) => handleChange('cameraQuality', itemValue)}
      >
        <Picker.Item label="Select Camera Quality" value="" />
        {cameraQualities.map((quality) => (
          <Picker.Item key={quality} label={quality} value={quality} />
        ))}
      </Picker>

      <Text style={styles.label}>RAM Size</Text>
      <Picker
        selectedValue={mobile.ramSize}
        style={styles.picker}
        onValueChange={(itemValue) => handleChange('ramSize', itemValue)}
      >
        <Picker.Item label="Select RAM Size" value="" />
        {ramSizes.map((size) => (
          <Picker.Item key={size} label={size} value={size} />
        ))}
      </Picker>

      <Text style={styles.label}>Storage Size</Text>
      <Picker
        selectedValue={mobile.storageSize}
        style={styles.picker}
        onValueChange={(itemValue) => handleChange('storageSize', itemValue)}
      >
        <Picker.Item label="Select Storage Size" value="" />
        {storageSizes.map((size) => (
          <Picker.Item key={size} label={size} value={size} />
        ))}
      </Picker>

      <Text style={styles.sectionTitle}>Condition</Text>

      <Text style={styles.label}>Condition</Text>
      <Picker
        selectedValue={mobile.condition}
        style={styles.picker}
        onValueChange={(itemValue) => handleChange('condition', itemValue)}
      >
        {conditions.map((condition) => (
          <Picker.Item key={condition} label={condition} value={condition} />
        ))}
      </Picker>

      {mobile.condition === 'Used' && (
        <>
          <Text style={styles.label}>Condition Details</Text>
          <Picker
            selectedValue={mobile.conditionDetails}
            style={styles.picker}
            onValueChange={(itemValue) => handleChange('conditionDetails', itemValue)}
          >
            <Picker.Item label="Select Condition Details" value={null} />
            {mobileConditions.map((condition) => (
              <Picker.Item key={condition.id} label={condition.condition} value={condition} />
            ))}
          </Picker>
        </>
      )}

      <TouchableOpacity 
        style={styles.submitButton} 
        onPress={handleSubmit}
        disabled={isLoading}
      >
        <Text style={styles.submitButtonText}>
          {isLoading ? 'Processing...' : isEditing ? 'Update Mobile' : 'Add Mobile'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
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
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 10,
    borderRadius: 5,
  },
  imageButton: {
    backgroundColor: '#6c757d',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  imageButtonText: {
    color: 'white',
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  picker: {
    backgroundColor: 'white',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 15,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MobileForm;