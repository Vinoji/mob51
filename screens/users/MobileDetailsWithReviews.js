import React, { useState,useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity,Alert} from 'react-native';
import { getMobileById, addMobileReview } from '../../services/enhancedMobileService';
import { useFetchMobileReviews,toggleFavorite } from '../../services/enhancedMobileService';
import LoadingIndicator from '../../components/LoadingIndicator';
import ErrorView from '../../components/ErrorView';
import { AuthContext } from '../../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
const MobileDetailsWithReviews = ({ route }) => {
  const { user } = useContext(AuthContext);
  const { mobileId } = route.params;
  const [mobile, setMobile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [review, setReview] = useState({
    rating: 5,
    comment: '',
    userName: 'Anonymous', // In a real app, this would come from user auth
  });
  const { reviews, loading: reviewsLoading } = useFetchMobileReviews(mobileId);

  useEffect(() => {
    const loadMobile = async () => {
      try {
        setLoading(true);
        const mobileData = await getMobileById(mobileId);
        setMobile(mobileData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMobile();
  }, [mobileId]);

  if (loading) {
    return <LoadingIndicator />;
  }
  const handleToggleFavorite = async () => {
    if (!user) {
      // Handle not logged in case - maybe show login prompt
      alert("Please log in to add favorites");
      return;
    }

    try {
      const result = await toggleFavorite(user.uid, mobileId);
      setIsFavorite(result.isFavorite);
    } catch (error) {
      console.error("Error toggling favorite: ", error);
    }
  };
  if (error) {
    return <ErrorView message={error} onRetry={loadMobile} />;
  }

  const handleSubmitReview = async () => {
    try {
      await addMobileReview(mobileId, {
        ...review,
        userId: 'user123', // In a real app, this would come from user auth
      });
      setReview({ ...review, comment: '' });
      Alert.alert('Success', 'Your review has been submitted');
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', 'Failed to submit review');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading mobile details...</Text>
      </View>
    );
  }

  if (!mobile) {
    return (
      <View style={styles.container}>
        <Text>Mobile not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {mobile.imageUrl && (
        <Image source={{ uri: mobile.imageUrl }} style={styles.image} />
      )}
 <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={handleToggleFavorite}
        >
          <Ionicons 
            name={isFavorite ? "heart" : "heart-outline"} 
            size={28} 
            color={isFavorite ? "red" : "black"} 
          />
        </TouchableOpacity>
      <View style={styles.header}>
        <Text style={styles.name}>{mobile.name}</Text>
        <Text style={styles.brand}>{mobile.brand}</Text>
        <Text style={styles.price}>${mobile.price}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{mobile.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Specifications</Text>
        <View style={styles.specRow}>
          <Text style={styles.specLabel}>Screen Size:</Text>
          <Text style={styles.specValue}>{mobile.screenSize || 'N/A'}</Text>
        </View>
        <View style={styles.specRow}>
          <Text style={styles.specLabel}>Battery:</Text>
          <Text style={styles.specValue}>{mobile.batteryCapacity || 'N/A'}</Text>
        </View>
        <View style={styles.specRow}>
          <Text style={styles.specLabel}>Camera:</Text>
          <Text style={styles.specValue}>{mobile.cameraQuality || 'N/A'}</Text>
        </View>
        <View style={styles.specRow}>
          <Text style={styles.specLabel}>RAM:</Text>
          <Text style={styles.specValue}>{mobile.ramSize || 'N/A'}</Text>
        </View>
        <View style={styles.specRow}>
          <Text style={styles.specLabel}>Storage:</Text>
          <Text style={styles.specValue}>{mobile.storageSize || 'N/A'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer Reviews</Text>
        
        {reviewsLoading ? (
          <Text>Loading reviews...</Text>
        ) : reviews.length === 0 ? (
          <Text>No reviews yet. Be the first to review!</Text>
        ) : (
          reviews.map((review) => (
            <View key={review.id} style={styles.reviewItem}>
              <Text style={styles.reviewUser}>{review.userName}</Text>
              <Text style={styles.reviewRating}>Rating: {review.rating}/5</Text>
              <Text style={styles.reviewComment}>{review.comment}</Text>
              <Text style={styles.reviewDate}>
                {new Date(review.createdAt?.seconds * 1000).toLocaleDateString()}
              </Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add Your Review</Text>
        
        <Text style={styles.label}>Rating</Text>
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity 
              key={star} 
              onPress={() => setReview({ ...review, rating: star })}
            >
              <Text style={[
                styles.star, 
                star <= review.rating ? styles.starSelected : null
              ]}>
                ★
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <Text style={styles.label}>Comment</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Share your thoughts about this mobile..."
          value={review.comment}
          onChangeText={(text) => setReview({ ...review, comment: text })}
          multiline
          numberOfLines={4}
        />
        
        <TouchableOpacity 
          style={styles.submitReviewButton}
          onPress={handleSubmitReview}
          disabled={!review.comment}
        >
          <Text style={styles.submitReviewButtonText}>Submit Review</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'contain',
    marginBottom: 20,
    borderRadius: 10,
  },
  header: {
    marginBottom: 20,
  },
  favoriteButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 10,
    zIndex: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  brand: {
    fontSize: 18,
    color: '#666',
    marginBottom: 5,
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007bff',
  },
  section: {
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  specLabel: {
    fontWeight: 'bold',
    color: '#555',
  },
  specValue: {
    color: '#333',
  },
  reviewItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  reviewUser: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  reviewRating: {
    color: '#ffc107',
    fontWeight: 'bold',
    marginVertical: 5,
  },
  reviewComment: {
    fontSize: 14,
    marginBottom: 5,
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  star: {
    fontSize: 24,
    color: '#ccc',
    marginRight: 5,
  },
  starSelected: {
    color: '#ffc107',
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
  submitReviewButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitReviewButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MobileDetailsWithReviews;