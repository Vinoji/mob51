// components/MobileForm.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const MobileForm = ({ initialData, onSubmit, onCancel }) => {
  const [mobile, setMobile] = useState(
    initialData || {
      name: "",
      brand: "",
      price: "",
      description: "",
      imageUrl: "",
    }
  );
  const [imageUri, setImageUri] = useState(initialData?.imageUrl || null);

  const handleChange = (name, value) => {
    setMobile({ ...mobile, [name]: value });
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
    if (!mobile.name || !mobile.brand || !mobile.price) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    try {
      await onSubmit(mobile, imageUri);
      setMobile({
        name: "",
        brand: "",
        price: "",
        description: "",
        imageUrl: "",
      });
      setImageUri(null);
    } catch (error) {
      Alert.alert("Error", "Failed to save mobile");
    }
  };

  return (
    <View style={styles.form}>
      <Text style={styles.title}>
        {initialData ? "Edit Mobile" : "Add New Mobile"}
      </Text>

      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text>Tap to select an image</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Brand (e.g., Apple, Samsung)"
        value={mobile.brand}
        onChangeText={(text) => handleChange("brand", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Model Name"
        value={mobile.name}
        onChangeText={(text) => handleChange("name", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={mobile.price}
        onChangeText={(text) => handleChange("price", text)}
        keyboardType="numeric"
      />
      <TextInput
        style={[styles.input, styles.descriptionInput]}
        placeholder="Description"
        value={mobile.description}
        onChangeText={(text) => handleChange("description", text)}
        multiline
        numberOfLines={4}
      />

      <View style={styles.buttons}>
        <Button
          title={initialData ? "Update" : "Add"}
          onPress={handleSubmit}
          color="#4CAF50"
        />
        {onCancel && (
          <Button title="Cancel" onPress={onCancel} color="#F44336" />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  descriptionInput: {
    height: 80,
    textAlignVertical: "top",
  },
  imagePicker: {
    marginBottom: 16,
    alignItems: "center",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  imagePlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
});

export default MobileForm;