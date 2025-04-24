import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Linking,
  ToastAndroid,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';

const ProductDetailsScreen = ({ route, navigation }) => {
  const [addingToCart, setAddingToCart] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { product } = route.params;
  const flatListRef = useRef(null);

  // Get cart context
  const { addToCart } = useCart();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setCurrentUser(user);
          // Fetch user profile
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error) throw error;
          setUserProfile(profile);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);



  const isProfileComplete = () => {
    if (!userProfile) return false;
    return !!userProfile.username && !!userProfile.full_name;
  };

  const isSelfListing = () => {
    return currentUser && product.user_id === currentUser.id;
  };

  if (addingToCart) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#FED766" />
        <Text style={styles.loadingText}>Adding to cart...</Text>
      </View>
    );
  }

  const getImages = (images) => {
    try {
      if (typeof images === 'string') {
        return JSON.parse(images);
      }
      return Array.isArray(images) ? images : [];
    } catch (e) {
      console.error('Error parsing images:', e);
      return [];
    }
  };

  const images = getImages(product.images);

  const handleAddToCart = async () => {
    if (!currentUser) {
      Alert.alert('Error', 'Please login to add items to cart');
      return;
    }

    if (!isProfileComplete()) {
      Alert.alert(
        'Profile Incomplete',
        'Please complete your profile (username and full name) before adding items to cart.',
        [
          { text: 'OK' },
          { 
            text: 'Go to Profile', 
            onPress: () => navigation.navigate('Profile')
          }
        ]
      );
      return;
    }

    if (isSelfListing()) {
      Alert.alert('Error', 'You cannot add your own listings to cart');
      return;
    }

    try {
      setAddingToCart(true);
      await addToCart(product);
      ToastAndroid.show('Added item to cart!', ToastAndroid.SHORT);
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', error.message || 'Failed to add item to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleContactSeller = () => {
    // You can implement chat functionality here
    // For now, we'll just show the seller's information
    const sellerName = product.profiles?.username || 'Unknown Seller';
    alert(`Contact seller: ${sellerName}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageContainer}>
          {images.length > 0 ? (
            <View>
              <FlatList
                ref={flatListRef}
                data={images}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(event) => {
                  const newIndex = Math.round(
                    event.nativeEvent.contentOffset.x / width
                  );
                  setCurrentImageIndex(newIndex);
                }}
                getItemLayout={(data, index) => ({
                  length: width,
                  offset: width * index,
                  index,
                })}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('FullImage', { images, initialIndex: index })}
                  >
                    <Image
                      source={{ uri: item }}
                      style={styles.image}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
              {/* Image indicators */}
              <View style={styles.indicatorContainer}>
                {images.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.indicator,
                      index === currentImageIndex && styles.activeIndicator,
                    ]}
                  />
                ))}
              </View>
            </View>
          ) : (
            <View style={[styles.image, styles.placeholder]}>
              <Text style={styles.placeholderText}>No Image</Text>
            </View>
          )}
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>₹{product.price}</Text>
          <Text style={styles.condition}>Condition: {product.condition}</Text>
          
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description || 'No description provided'}</Text>
          
          <Text style={styles.sectionTitle}>Details</Text>
          <Text style={styles.description}>{product.detail || 'No additional details'}</Text>

          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Additional Details</Text>
            <Text style={styles.description}>{product.detail}</Text>
          </View>

          <View style={styles.sellerInfo}>
            <Text style={styles.sectionTitle}>Seller Information</Text>
            <Text style={styles.sellerName}>Posted by: {product.profiles.username}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.contactButton]}
          onPress={async () => {
            // Get current user ID (buyer)
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const buyerId = user.id;
            const sellerId = product.user_id;
            if (buyerId === sellerId) {
              Alert.alert('Error', 'You cannot chat with yourself (seller cannot chat with himself).');
              return;
            }
            navigation.navigate('Chat', {
              product: {
                ...product,
                seller: {
                  name: product.profiles?.full_name || 'Seller'
                }
              },
              buyerId,
              sellerId,
            });
          }}>
          <View style={styles.buttonContent}>
            <Ionicons name="chatbubble-outline" size={20} color="#272727" />
            <Text style={styles.contactButtonText}>Contact Seller</Text>
          </View>
        </TouchableOpacity>



        <TouchableOpacity
          style={[styles.actionButton, styles.cartButton]}
          onPress={handleAddToCart}
          disabled={addingToCart}
        >
          <View style={styles.buttonContent}>
            <Ionicons name="cart-outline" size={20} color="#272727" />
            <Text style={{fontSize:15}}>Add to Cart</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 20, // Add padding to prevent content from being hidden behind buttons
  },
  cartSection: {
    width: '100%',
    marginBottom: 10,
  },

  container: {
    flex: 1,
    backgroundColor: '#272727',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FED766',
    marginTop: 10,
    fontSize: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#272727',
    paddingVertical: 10,
    paddingHorizontal: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  quantityControlsFooter: {
    width: '32%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 25,
    width: '32%',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  noImage: {
    backgroundColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#fff',
    fontSize: 16,
  },
  imageContainer: {
    height: width * 0.8,
  },
  image: {
    width: width,
    height: height * 0.4,
    resizeMode: 'cover',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF80',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#FED766',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  detailsContainer: {
    padding: 20,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#118C4F',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
  },
  descriptionContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FED766',
    marginBottom: 10,
  },
  description: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
  },
  detailsSection: {
    marginTop: 20,
  },
  sellerInfo: {
    marginTop: 20,
    marginBottom: 80,
  },
  sellerName: {
    color: '#fff',
    fontSize: 16,
  },
  contactButton: {
    backgroundColor: '#fed766',
    borderWidth: 1,
    borderColor: '#FED766',
    elevation: 3,
    marginLeft:20,
    width: "43%"
  },
  cartButton: {
    backgroundColor: '#FED766',
    elevation: 3,
    marginRight:20,
    width : "43%"
  },
  contactButtonText: {
    color: '#272727',
    fontSize: 15,
    
    

  },
  condition: {
    fontSize: 16,
    color: '#FED766',
    marginBottom: 10,
  },
});

export default ProductDetailsScreen;
