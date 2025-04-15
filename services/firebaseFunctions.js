import { db } from "../config/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { useState, useEffect } from "react";

// **Add Item**
export const addItem = async (item) => {
  try {
    await addDoc(collection(db, "items"), {
      name: item.name,
      price: item.price,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Error adding item: ", error);
  }
};

// **Fetch Items (Real-time Listener)**
export const useFetchItems = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const itemsRef = collection(db, "items");
    const unsubscribe = onSnapshot(itemsRef, (snapshot) => {
      setItems(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    });

    return () => unsubscribe();
  }, []);

  return items;
};

// **Update Item**
export const updateItem = async (id, updatedItem) => {
  try {
    const itemRef = doc(db, "items", id);
    await updateDoc(itemRef, updatedItem);
  } catch (error) {
    console.error("Error updating item: ", error);
  }
};

// **Delete Item**
export const deleteItem = async (id) => {
  try {
    const itemRef = doc(db, "items", id);
    await deleteDoc(itemRef);
  } catch (error) {
    console.error("Error deleting item: ", error);
  }
};
