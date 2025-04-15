import { useState } from "react";
import { View, Button, Image, TextInput } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { uploadImageAndSaveProduct } from "../utils/firebaseUtils";

const SellScreen = () => {
  const [imageUri, setImageUri] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const selectImage = () => {
    launchImageLibrary({ mediaType: "photo" }, async (response) => {
      if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        setImageUri(uri);
      }
    });
  };

  const handleSubmit = async () => {
    if (!name || !price || !imageUri) {
      alert("Please fill all fields and select an image.");
      return;
    }
    await uploadImageAndSaveProduct(imageUri, { name, price });
    alert("Product added successfully!");
  };

  return (
    <View>
      {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />}
      <Button title="Select Image" onPress={selectImage} />
      <TextInput placeholder="Product Name" value={name} onChangeText={setName} />
      <TextInput placeholder="Price" value={price} onChangeText={setPrice} keyboardType="numeric" />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

export default SellScreen;
