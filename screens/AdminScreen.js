// screens/AdminScreen.js
import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Button,Text } from "react-native";
import MobileCard from "../components/MobileCard";
import MobileForm from "../components/MobileForm";
import { useFetchMobiles, addMobile, updateMobile, deleteMobile } from "../services/enhancedMobileService";
import RazorpayCheckout from "react-native-razorpay";
const AdminScreen = () => {
  const { mobiles, loading } = useFetchMobiles();
  const [editingMobile, setEditingMobile] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleAddMobile = async (mobile, imageUri) => {
    try {
      await addMobile(mobile, imageUri);
      setShowForm(false);
    } catch (error) {
      console.error("Error adding mobile:", error);
    }
  };

  const handleUpdateMobile = async (mobile, imageUri) => {
    try {
      await updateMobile(editingMobile.id, mobile, imageUri);
      setEditingMobile(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error updating mobile:", error);
    }
  };

  const handleDeleteMobile = async (id) => {
    try {
      await deleteMobile(id);
    } catch (error) {
      console.error("Error deleting mobile:", error);
    }
  };

  return (
    <View style={styles.container}>
      {showForm || editingMobile ? (
        <MobileForm
          initialData={editingMobile}
          onSubmit={editingMobile ? handleUpdateMobile : handleAddMobile}
          onCancel={() => {
            setEditingMobile(null);
            setShowForm(false);
          }}
        />
      ) : (
        <Button
          title="Add New Mobile"
          onPress={() => setShowForm(true)}
          color="#4CAF50"
        />
      )}

      <ScrollView style={styles.list}>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          mobiles.map((mobile) => (
            <MobileCard
              key={mobile.id}
              mobile={mobile}
              onUpdate={() => {
                setEditingMobile(mobile);
                setShowForm(true);
              }}
              onDelete={handleDeleteMobile}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  list: {
    marginTop: 16,
  },
});

export default AdminScreen;