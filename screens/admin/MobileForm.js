import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ScrollView, Image, TouchableOpacity, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { addMobile, updateMobile, getMobileById } from '../../services/enhancedMobileService';
import { categories, screenSizes, batteryCapacities, cameraQualities, ramSizes, storageSizes, conditions, mobileConditions, mobiles } from '../../constants/mobileConstants';

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
    isTodayDeal: false,
    isBestSelling: false,
  });
  const [imageUri, setImageUri] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [brandModels, setBrandModels] = useState([]);
  const [customInputs, setCustomInputs] = useState({
    screenSize: false,
    batteryCapacity: false,
    cameraQuality: false,
    ramSize: false,
    storageSize: false,
  });

  useEffect(() => {
    if (mobileId) {
      setIsEditing(true);
      loadMobileData();
    }
  }, [mobileId]);

  useEffect(() => {
    // Update available models when brand changes
    const selectedBrandMobiles = mobiles.find(item => item.brandName === mobile.brand);
    setBrandModels(selectedBrandMobiles?.mobiles || []);
  }, [mobile.brand]);

  const loadMobileData = async () => {
    try {
      setIsLoading(true);
      const mobileData = await getMobileById(mobileId);
      setMobile(mobileData);
      if (mobileData.imageUrl) {
        setImageUri(mobileData.imageUrl);
      }
      
      // Check if any values are custom (not in the predefined lists)
      setCustomInputs({
        screenSize: !screenSizes.includes(mobileData.screenSize) && mobileData.screenSize !== '',
        batteryCapacity: !batteryCapacities.includes(mobileData.batteryCapacity) && mobileData.batteryCapacity !== '',
        cameraQuality: !cameraQualities.includes(mobileData.cameraQuality) && mobileData.cameraQuality !== '',
        ramSize: !ramSizes.includes(mobileData.ramSize) && mobileData.ramSize !== '',
        storageSize: !storageSizes.includes(mobileData.storageSize) && mobileData.storageSize !== '',
      });
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

  const toggleCustomInput = (field) => {
    setCustomInputs(prev => {
      const updated = { ...prev, [field]: !prev[field] };
      if (updated[field]) {
        // Clear the field value when switching to custom input
        handleChange(field, '');
      }
      return updated;
    });
  };

  const renderSpecificationField = (field, label, options, placeholder) => {
    return (
      <>
        <View style={styles.fieldHeaderContainer}>
          <Text style={styles.label}>{label}</Text>
          <TouchableOpacity 
            style={styles.customInputToggle} 
            onPress={() => toggleCustomInput(field)}
          >
            <Text style={styles.customInputToggleText}>
              {customInputs[field] ? 'Use Dropdown' : 'Custom Input'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {customInputs[field] ? (
          <TextInput
            style={styles.input}
            placeholder={`Enter custom ${label.toLowerCase()}`}
            value={mobile[field]}
            onChangeText={(text) => handleChange(field, text)}
          />
        ) : (
          <Picker
            selectedValue={mobile[field]}
            style={styles.picker}
            onValueChange={(itemValue) => handleChange(field, itemValue)}
          >
            <Picker.Item label={placeholder} value="" />
            {options.map((option) => (
              <Picker.Item key={option} label={option} value={option} />
            ))}
          </Picker>
        )}
      </>
    );
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

      <Text style={styles.label}>Model</Text>
      <View style={styles.modelSelectionContainer}>
        <Picker
          selectedValue={mobile.name}
          style={[styles.picker, styles.modelPicker]}
          onValueChange={(itemValue) => handleChange('name', itemValue)}
        >
          <Picker.Item label="Select Model" value="" />
          {brandModels.map((model) => (
            <Picker.Item key={model.id} label={model.name} value={model.name} />
          ))}
        </Picker>
        <Text style={styles.orText}>OR</Text>
        <TextInput
          style={[styles.input, styles.modelInput]}
          placeholder="Custom Model Name"
          value={brandModels.some(model => model.name === mobile.name) ? '' : mobile.name}
          onChangeText={(text) => handleChange('name', text)}
        />
      </View>

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

      {renderSpecificationField('screenSize', 'Screen Size', screenSizes, 'Select Screen Size')}
      {renderSpecificationField('batteryCapacity', 'Battery Capacity', batteryCapacities, 'Select Battery Capacity')}
      {renderSpecificationField('cameraQuality', 'Camera Quality', cameraQualities, 'Select Camera Quality')}
      {renderSpecificationField('ramSize', 'RAM Size', ramSizes, 'Select RAM Size')}
      {renderSpecificationField('storageSize', 'Storage Size', storageSizes, 'Select Storage Size')}

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

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Today's Deal</Text>
        <Switch
          value={mobile.isTodayDeal}
          onValueChange={(value) => handleChange('isTodayDeal', value)}
          trackColor={{ false: "#767577", true: "#4CAF50" }}
        />
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Best Selling</Text>
        <Switch
          value={mobile.isBestSelling}
          onValueChange={(value) => handleChange('isBestSelling', value)}
          trackColor={{ false: "#767577", true: "#4CAF50" }}
        />
      </View>

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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 15,
  },
  fieldHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  customInputToggle: {
    backgroundColor: '#007bff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  customInputToggleText: {
    color: 'white',
    fontSize: 12,
  },
  modelSelectionContainer: {
    marginBottom: 15,
  },
  modelPicker: {
    marginBottom: 5,
  },
  modelInput: {
    marginTop: 5,
  },
  orText: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginVertical: 5,
  },
});

export default MobileForm;