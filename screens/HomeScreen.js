import React from "react";
import { View, Button, FlatList, StyleSheet } from "react-native";
import { addItem, updateItem, deleteItem } from "../services/firebaseFunctions";
import { useFetchItems } from "../services/firebaseFunctions";
import ItemCard from "../components/ItemCard";

const HomeScreen = () => {
  const items = useFetchItems();

  return (
    <View style={styles.container}>
      <Button
        title="Add Item"
        onPress={() => addItem({ name: "New Item", price: Math.floor(Math.random() * 100) })}
      />

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ItemCard 
            item={item} 
            onUpdate={() => updateItem(item.id, { name: "Updated Item", price: 200 })} 
            onDelete={() => deleteItem(item.id)} 
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
});

export default HomeScreen;
