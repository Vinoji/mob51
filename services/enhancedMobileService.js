// services/enhancedMobileService.js
import { db, storage } from "../config/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  getDoc,
  serverTimestamp
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { useState, useEffect } from "react";

// **Add Mobile with Image Upload**
export const addMobile = async (mobile, imageUri) => {
  try {
    // Upload image first if provided
    let imageUrl = '';
    if (imageUri) {
      console.log("Starting image upload process with URI:", imageUri);
      
      try {
        // Check if imageUri is valid
        console.log("Checking image URI format");
        if (!imageUri || typeof imageUri !== 'string') {
          throw new Error("Invalid image URI format");
        }
        
        console.log("Fetching image from URI");
        const response = await fetch(imageUri);
        console.log("Response status:", response.status);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.status}`);
        }
        
        const blob = await response.blob();
        console.log("Created blob, size:", blob.size, "type:", blob.type);
        
        if (blob.size === 0) {
          throw new Error("Empty blob created");
        }
        
        const filename = `mobile-images/${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
        console.log("Generated filename:", filename);
        
        const storageRef = ref(storage, filename);
        console.log("Storage reference created");
        
        console.log("Starting upload");
        const snapshot = await uploadBytes(storageRef, blob);
        console.log("Upload completed, metadata:", snapshot.metadata);
        
        console.log("Getting download URL");
        imageUrl = await getDownloadURL(snapshot.ref);
        console.log("Got download URL:", imageUrl);
      } catch (uploadError) {
        console.error("Detailed upload error:", uploadError);
        console.error("Error code:", uploadError.code);
        console.error("Error message:", uploadError.message);
        throw uploadError;
      }
    }

    console.log("Adding document to Firestore");
    // Add mobile data to Firestore
    const mobileData = {
      name: mobile.name,
      brand: mobile.brand,
      price: mobile.price,
      description: mobile.description,
      imageUrl: imageUrl,
      screenSize: mobile.screenSize || '',
      batteryCapacity: mobile.batteryCapacity || '',
      cameraQuality: mobile.cameraQuality || '',
      ramSize: mobile.ramSize || '',
      storageSize: mobile.storageSize || '',
      condition: mobile.condition || 'New',
      conditionDetails: mobile.conditionDetails || null,
      isBestSelling: mobile.isBestSelling || false,
      isTodayDeal: mobile.isTodayDeal || false,
      createdAt: new Date(),
    };
    
    const docRef = await addDoc(collection(db, "mobiles"), mobileData);
    console.log("Document added successfully with ID:", docRef.id);
    return { id: docRef.id, ...mobileData };
  } catch (error) {
    console.error("Error adding mobile: ", error);
    throw error;
  }
};

// **Get Mobile by ID**
export const getMobileById = async (id) => {
  try {
    const mobileRef = doc(db, "mobiles", id);
    const docSnap = await getDoc(mobileRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Mobile not found");
    }
  } catch (error) {
    console.error("Error getting mobile: ", error);
    throw error;
  }
};

// **Fetch Mobiles (Real-time Listener)**
export const useFetchMobiles = () => {
  const [mobiles, setMobiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mobilesRef = collection(db, "mobiles");
    const unsubscribe = onSnapshot(mobilesRef, (snapshot) => {
      const mobilesData = snapshot.docs.map((doc) => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      setMobiles(mobilesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { mobiles, loading };
};

// **Fetch Best Selling Mobiles**
export const useFetchBestSellingMobiles = (limit = 5) => {
  const [mobiles, setMobiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mobilesRef = collection(db, "mobiles");
    const q = query(
      mobilesRef, 
      where("isBestSelling", "==", true),
      limit(limit)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const mobilesData = snapshot.docs.map((doc) => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      setMobiles(mobilesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [limit]);

  return { mobiles, loading };
};

// **Fetch Today's Deal Mobiles**
export const useFetchTodayDealMobiles = (limit = 5) => {
  const [mobiles, setMobiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mobilesRef = collection(db, "mobiles");
    const q = query(
      mobilesRef, 
      where("isTodayDeal", "==", true),
      limit(limit)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const mobilesData = snapshot.docs.map((doc) => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      setMobiles(mobilesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [limit]);

  return { mobiles, loading };
};

// **Fetch Mobiles by Brand (Real-time)**
export const useFetchMobilesByBrand = (brand) => {
  const [mobiles, setMobiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!brand) {
      setMobiles([]);
      setLoading(false);
      return;
    }

    const mobilesRef = collection(db, "mobiles");
    const q = query(mobilesRef, where("brand", "==", brand));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const mobilesData = snapshot.docs.map((doc) => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      setMobiles(mobilesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [brand]);

  return { mobiles, loading };
};

// **Fetch Featured Mobiles (newest 5)**
export const useFeaturedMobiles = (limit = 5) => {
  const [mobiles, setMobiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mobilesRef = collection(db, "mobiles");
    const q = query(mobilesRef, orderBy("createdAt", "desc"), limit(limit));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const mobilesData = snapshot.docs.map((doc) => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      setMobiles(mobilesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [limit]);

  return { mobiles, loading };
};

// **Toggle Best Selling Status**
export const toggleBestSelling = async (id, status) => {
  try {
    const mobileRef = doc(db, "mobiles", id);
    await updateDoc(mobileRef, {
      isBestSelling: status
    });
    return { success: true };
  } catch (error) {
    console.error("Error toggling best selling status: ", error);
    throw error;
  }
};

// **Toggle Today's Deal Status**
export const toggleTodayDeal = async (id, status) => {
  try {
    const mobileRef = doc(db, "mobiles", id);
    await updateDoc(mobileRef, {
      isTodayDeal: status
    });
    return { success: true };
  } catch (error) {
    console.error("Error toggling today's deal status: ", error);
    throw error;
  }
};

// **Update Mobile with optional Image Update**
export const updateMobile = async (id, updatedMobile, newImageUri) => {
  try {
    const mobileRef = doc(db, "mobiles", id);
    let updateData = {
      name: updatedMobile.name,
      brand: updatedMobile.brand,
      price: updatedMobile.price,
      description: updatedMobile.description,
      screenSize: updatedMobile.screenSize || '',
      batteryCapacity: updatedMobile.batteryCapacity || '',
      cameraQuality: updatedMobile.cameraQuality || '',
      ramSize: updatedMobile.ramSize || '',
      storageSize: updatedMobile.storageSize || '',
      condition: updatedMobile.condition || 'New',
      conditionDetails: updatedMobile.conditionDetails || null,
      isBestSelling: updatedMobile.isBestSelling || false,
      isTodayDeal: updatedMobile.isTodayDeal || false,
      updatedAt: new Date(),
    };

    // Get current mobile data to find existing image URL
    const docSnap = await getDoc(mobileRef);
    if (!docSnap.exists()) {
      throw new Error("Mobile not found");
    }
    const currentData = docSnap.data();

    if (newImageUri) {
      const response = await fetch(newImageUri);
      const blob = await response.blob();
      const filename = `mobile-images/${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      const storageRef = ref(storage, filename);
      const snapshot = await uploadBytes(storageRef, blob);
      const imageUrl = await getDownloadURL(snapshot.ref);
      updateData.imageUrl = imageUrl;
      
      // Delete the old image if it exists
      if (currentData.imageUrl) {
        try {
          // Extract the path from the URL
          const oldImagePath = currentData.imageUrl.split('mobile-images/')[1]?.split('?')[0];
          if (oldImagePath) {
            const oldImageRef = ref(storage, `mobile-images/${oldImagePath}`);
            await deleteObject(oldImageRef);
            console.log("Old image deleted successfully");
          }
        } catch (deleteError) {
          console.error("Error deleting old image (continuing anyway): ", deleteError);
        }
      }
    }

    await updateDoc(mobileRef, updateData);
    return { id, ...updateData };
  } catch (error) {
    console.error("Error updating mobile: ", error);
    throw error;
  }
};

// **Delete Mobile and its image**
export const deleteMobile = async (id) => {
  try {
    // Get the mobile data first to get the image URL
    const mobileRef = doc(db, "mobiles", id);
    const docSnap = await getDoc(mobileRef);
    
    if (!docSnap.exists()) {
      throw new Error("Mobile not found");
    }
    
    const mobileData = docSnap.data();
    
    // Delete the document from Firestore
    await deleteDoc(mobileRef);
    
    // Delete the image if it exists
    if (mobileData.imageUrl) {
      try {
        // Extract the path from the URL
        const imagePath = mobileData.imageUrl.split('mobile-images/')[1]?.split('?')[0];
        if (imagePath) {
          const imageRef = ref(storage, `mobile-images/${imagePath}`);
          await deleteObject(imageRef);
          console.log("Image deleted successfully");
        }
      } catch (deleteError) {
        console.error("Error deleting image: ", deleteError);
      }
    }
    
    return { success: true, id };
  } catch (error) {
    console.error("Error deleting mobile: ", error);
    throw error;
  }
};

// **Search Mobiles**
export const searchMobiles = async (searchTerm) => {
  try {
    const mobilesRef = collection(db, "mobiles");
    const snapshot = await getDocs(mobilesRef);
    
    const results = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(mobile => {
        const searchLower = searchTerm.toLowerCase();
        return (
          mobile.name.toLowerCase().includes(searchLower) ||
          mobile.brand.toLowerCase().includes(searchLower) ||
          mobile.description.toLowerCase().includes(searchLower)
        );
      });
      
    return results;
  } catch (error) {
    console.error("Error searching mobiles: ", error);
    throw error;
  }
};

// **Filter Mobiles**
export const filterMobiles = async (filters) => {
  try {
    const mobilesRef = collection(db, "mobiles");
    const snapshot = await getDocs(mobilesRef);
    
    let results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Apply filters if they exist
    if (filters) {
      if (filters.brand) {
        results = results.filter(mobile => mobile.brand === filters.brand);
      }
      
      if (filters.minPrice) {
        results = results.filter(mobile => parseFloat(mobile.price) >= parseFloat(filters.minPrice));
      }
      
      if (filters.maxPrice) {
        results = results.filter(mobile => parseFloat(mobile.price) <= parseFloat(filters.maxPrice));
      }
      
      if (filters.screenSize) {
        results = results.filter(mobile => mobile.screenSize === filters.screenSize);
      }
      
      if (filters.batteryCapacity) {
        results = results.filter(mobile => mobile.batteryCapacity === filters.batteryCapacity);
      }
      
      if (filters.cameraQuality) {
        results = results.filter(mobile => mobile.cameraQuality === filters.cameraQuality);
      }
      
      if (filters.ramSize) {
        results = results.filter(mobile => mobile.ramSize === filters.ramSize);
      }
      
      if (filters.storageSize) {
        results = results.filter(mobile => mobile.storageSize === filters.storageSize);
      }
      
      if (filters.condition) {
        results = results.filter(mobile => mobile.condition === filters.condition);
      }
      
      // Added filters for Best Selling and Today's Deal
      if (filters.isBestSelling !== undefined) {
        results = results.filter(mobile => mobile.isBestSelling === filters.isBestSelling);
      }
      
      if (filters.isTodayDeal !== undefined) {
        results = results.filter(mobile => mobile.isTodayDeal === filters.isTodayDeal);
      }
    }
    
    return results;
  } catch (error) {
    console.error("Error filtering mobiles: ", error);
    throw error;
  }
};

// **Upload Multiple Images for a Mobile**
export const uploadMobileGalleryImages = async (mobileId, imageUris) => {
  try {
    if (!imageUris || !Array.isArray(imageUris) || imageUris.length === 0) {
      throw new Error("No images provided for upload");
    }
    
    const imageUrls = [];
    
    // Upload each image
    for (const imageUri of imageUris) {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const filename = `mobile-galleries/${mobileId}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      const storageRef = ref(storage, filename);
      const snapshot = await uploadBytes(storageRef, blob);
      const imageUrl = await getDownloadURL(snapshot.ref);
      imageUrls.push(imageUrl);
    }
    
    // Update the mobile document with the new gallery images
    const mobileRef = doc(db, "mobiles", mobileId);
    const docSnap = await getDoc(mobileRef);
    
    if (!docSnap.exists()) {
      throw new Error("Mobile not found");
    }
    
    const currentGallery = docSnap.data().galleryImages || [];
    
    await updateDoc(mobileRef, {
      galleryImages: [...currentGallery, ...imageUrls]
    });
    
    return imageUrls;
  } catch (error) {
    console.error("Error uploading gallery images: ", error);
    throw error;
  }
};

// **Remove Gallery Image**
export const removeGalleryImage = async (mobileId, imageUrl) => {
  try {
    const mobileRef = doc(db, "mobiles", mobileId);
    const docSnap = await getDoc(mobileRef);
    
    if (!docSnap.exists()) {
      throw new Error("Mobile not found");
    }
    
    const currentData = docSnap.data();
    const galleryImages = currentData.galleryImages || [];
    
    // Remove the image URL from the array
    const updatedGallery = galleryImages.filter(url => url !== imageUrl);
    
    // Update the document
    await updateDoc(mobileRef, {
      galleryImages: updatedGallery
    });
    
    // Delete the image from storage
    try {
      // Extract the path from the URL
      const imagePath = imageUrl.split('mobile-galleries/')[1]?.split('?')[0];
      if (imagePath) {
        const imageRef = ref(storage, `mobile-galleries/${imagePath}`);
        await deleteObject(imageRef);
        console.log("Gallery image deleted successfully");
      }
    } catch (deleteError) {
      console.error("Error deleting gallery image: ", deleteError);
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error removing gallery image: ", error);
    throw error;
  }
};

// **Add Mobile Review**
export const addMobileReview = async (mobileId, review) => {
  try {
    const reviewData = {
      userId: review.userId,
      userName: review.userName,
      rating: review.rating,
      comment: review.comment,
      createdAt: serverTimestamp() // Use server timestamp instead of local
    };
    
    const reviewRef = await addDoc(collection(db, "mobileReviews"), {
      mobileId,
      ...reviewData
    });
    
    return { id: reviewRef.id, ...reviewData };
  } catch (error) {
    console.error("Error adding review: ", error);
    throw error;
  }
};

// **Fetch Mobile Reviews**
export const useFetchMobileReviews = (mobileId) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mobileId) {
      setReviews([]);
      setLoading(false);
      return;
    }

    const reviewsRef = collection(db, "mobileReviews");
    // In useFetchMobileReviews
    const q = query(
      reviewsRef, 
      where("mobileId", "==", mobileId), 
      orderBy("createdAt", "desc"),
      limit(20) // Add reasonable limit
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reviewsData = snapshot.docs.map((doc) => ({ 
        id: doc.id, 
        ...doc.data(),
        // Convert Firestore timestamp to JS Date if needed
        createdAt: doc.data().createdAt?.toDate() 
      }));
      setReviews(reviewsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching reviews:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [mobileId]);

  return { reviews, loading };
};

// **Fetch Reviews Paginated**
export const fetchReviewsPaginated = async (mobileId, lastVisible = null) => {
  let q = query(
    collection(db, "mobileReviews"),
    where("mobileId", "==", mobileId),
    orderBy("createdAt", "desc"),
    limit(10)
  );

  if (lastVisible) {
    q = query(q, startAfter(lastVisible));
  }

  const snapshot = await getDocs(q);
  const reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  const newLastVisible = snapshot.docs[snapshot.docs.length - 1];

  return { reviews, lastVisible: newLastVisible };
};

export const useTodayDeals = () => {
  const [mobiles, setMobiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mobilesRef = collection(db, "mobiles");
    const q = query(
      mobilesRef, 
      where("isTodayDeal", "==", true),
      orderBy("createdAt", "desc"),
      limit(5)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const mobilesData = snapshot.docs.map((doc) => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      setMobiles(mobilesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [limit]);

  return { mobiles, loading };
};

// **Fetch Best Selling Mobiles**
export const useBestSelling = () => {
  const [mobiles, setMobiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mobilesRef = collection(db, "mobiles");
    const q = query(
      mobilesRef, 
      where("isBestSelling", "==", true),
      orderBy("createdAt", "desc"),
      limit(5)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const mobilesData = snapshot.docs.map((doc) => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      setMobiles(mobilesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [limit]);

  return { mobiles, loading };
};

// **Toggle Mobile Status (Today's Deal/Best Selling)**
export const toggleMobileStatus = async (mobileId, field) => {
  try {
    const mobileRef = doc(db, "mobiles", mobileId);
    const docSnap = await getDoc(mobileRef);
    
    if (docSnap.exists()) {
      const currentValue = docSnap.data()[field] || false;
      await updateDoc(mobileRef, {
        [field]: !currentValue,
        updatedAt: serverTimestamp()
      });
      return !currentValue;
    }
    return false;
  } catch (error) {
    console.error(`Error toggling ${field}:`, error);
    throw error;
  }
};

// Add these functions to services/enhancedMobileService.js

// **Toggle Favorite Status**
export const toggleFavorite = async (userId, mobileId) => {
  try {
    const favoriteRef = collection(db, "favorites");
    const q = query(
      favoriteRef,
      where("userId", "==", userId),
      where("mobileId", "==", mobileId)
    );
    
    const snapshot = await getDocs(q);
    
    // If favorite exists, remove it
    if (!snapshot.empty) {
      const favoriteDoc = snapshot.docs[0];
      await deleteDoc(doc(db, "favorites", favoriteDoc.id));
      return { isFavorite: false };
    } 
    // Otherwise, add it
    else {
      await addDoc(collection(db, "favorites"), {
        userId,
        mobileId,
        createdAt: serverTimestamp()
      });
      return { isFavorite: true };
    }
  } catch (error) {
    console.error("Error toggling favorite status: ", error);
    throw error;
  }
};

// **Check if Mobile is Favorite**
export const checkIsFavorite = async (userId, mobileId) => {
  try {
    const favoriteRef = collection(db, "favorites");
    const q = query(
      favoriteRef,
      where("userId", "==", userId),
      where("mobileId", "==", mobileId)
    );
    
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error("Error checking favorite status: ", error);
    throw error;
  }
};

// **Get User Favorites**
export const useFetchUserFavorites = (userId) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setFavorites([]);
      setLoading(false);
      return () => {};
    }

    const fetchFavorites = async () => {
      try {
        // Get the user's favorite mobile IDs
        const favoriteRef = collection(db, "favorites");
        const q = query(
          favoriteRef,
          where("userId", "==", userId),
          orderBy("createdAt", "desc")
        );
        
        const unsubscribe = onSnapshot(q, async (snapshot) => {
          const favoriteIds = snapshot.docs.map(doc => doc.data().mobileId);
          
          // If no favorites, return empty array
          if (favoriteIds.length === 0) {
            setFavorites([]);
            setLoading(false);
            return;
          }
          
          // Get all the mobile details for the favorites
          const mobilesData = [];
          for (const id of favoriteIds) {
            try {
              const mobileData = await getMobileById(id);
              mobilesData.push(mobileData);
            } catch (error) {
              console.error(`Error fetching mobile ${id}:`, error);
            }
          }
          
          setFavorites(mobilesData);
          setLoading(false);
        });
        
        return unsubscribe;
      } catch (error) {
        console.error("Error fetching favorites: ", error);
        setLoading(false);
        return () => {};
      }
    };

    const unsubscribe = fetchFavorites();
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [userId]);

  return { favorites, loading };
};