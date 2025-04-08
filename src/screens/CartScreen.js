import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useCart } from '../context/CartContext';

export default function CartScreen({ navigation }) {
  const { cartItems, removeFromCart, getTotalPrice, clearCart, loading } = useCart();

  const handleCheckout = () => {
    // In a real app, this would navigate to a checkout screen
    alert('Proceeding to checkout...');
    clearCart();
    navigation.navigate('Home');
  };

  const getImageUrl = (images) => {
    try {
      if (typeof images === 'string') {
        const parsedImages = JSON.parse(images);
        return parsedImages[0] || null;
      }
      return Array.isArray(images) ? images[0] : null;
    } catch (e) {
      console.error('Error parsing images:', e);
      return null;
    }
  };

  const renderItem = ({ item }) => {
    const imageUrl = getImageUrl(item.images);
    
    return (
      <TouchableOpacity 
        style={styles.item}
        onPress={() => navigation.navigate('ProductDetails', { product: item })}
      >
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.placeholder]}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
        <View style={styles.details}>
          <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.price}>₹{item.price}</Text>
          <Text style={styles.seller} numberOfLines={1}>Seller: {item.seller_name || 'Unknown'}</Text>
          <Text style={styles.location} numberOfLines={1}>📍 {item.location}</Text>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              removeFromCart(item.id);
            }}
            style={styles.removeButton}
          >
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FED766" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Cart</Text>
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalAmount}>₹{getTotalPrice().toLocaleString()}</Text>
            </View>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#272727',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#272727',
  },
  header: {
    padding: 16,
    backgroundColor: '#1a1a1a',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FED766',
  },
  list: {
    padding: 16,
  },
  item: {
    flexDirection: 'row',
    backgroundColor: '#333',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  image: {
    width: 100,
    height: 100,
  },
  placeholder: {
    backgroundColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#888',
  },
  details: {
    flex: 1,
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#fff',
  },
  price: {
    fontSize: 18,
    color: '#FED766',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  quantity: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 4,
  },
  seller: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 4,
  },
  location: {
    color: '#888',
    fontSize: 12,
    marginBottom: 8,
  },
  removeButton: {
    backgroundColor: '#f44336',
    padding: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  removeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    color: '#888',
    fontSize: 18,
    marginBottom: 16,
  },
  shopButton: {
    backgroundColor: '#FED766',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    backgroundColor: '#1a1a1a',
    padding: 16,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    color: '#fff',
    fontSize: 18,
  },
  totalAmount: {
    color: '#FED766',
    fontSize: 24,
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: '#FED766',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
