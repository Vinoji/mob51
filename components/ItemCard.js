import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const ItemCard = ({ item, onUpdate, onDelete }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.text}>{item.name} - ${item.price}</Text>
      <Button title="Update" onPress={() => onUpdate(item.id)} />
      <Button title="Delete" color="red" onPress={() => onDelete(item.id)} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: { padding: 10, marginVertical: 10, backgroundColor: "#f8f8f8", borderRadius: 5 },
  text: { fontSize: 16, marginBottom: 5 },
});

export default ItemCard;
