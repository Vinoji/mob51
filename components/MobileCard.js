// components/MobileCard.js
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const MobileCard = ({ mobile, onUpdate, onDelete }) => {
  return (
    <View style={styles.card}>
      {mobile.imageUrl && (
        <Image source={{ uri: mobile.imageUrl }} style={styles.image} />
      )}
      <View style={styles.details}>
        <Text style={styles.brand}>{mobile.brand}</Text>
        <Text style={styles.name}>{mobile.name}</Text>
        <Text style={styles.price}>${mobile.price}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {mobile.description}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => onUpdate(mobile)}>
          <Ionicons name="pencil" size={24} color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(mobile.id)}>
          <Ionicons name="trash" size={24} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 10,
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  brand: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2196F3",
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: "#777",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 60,
    alignItems: "center",
  },
});

export default MobileCard;