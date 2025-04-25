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
import {WebView} from 'react-native-webview';
import { useState } from 'react';
import { Modal } from 'react-native';


export default function CartScreen({ navigation }) {
  const { cartItems, removeFromCart, getTotalPrice, clearCart, loading } = useCart();
  const [webViewVisible, setWebViewVisible] = useState(false);
  const [checkoutHtml, setCheckoutHtml] = useState('');
  const [paymentUrl, setPaymentUrl] = useState(null);

  const handleCheckout = async () => {
    try {
      const amount = getTotalPrice(); // in INR
      const response = await fetch('https://2668-103-74-239-26.ngrok-free.app/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
  
      const data = await response.json();
  
      const html = `
        <html>
          <head>
            <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
          </head>
          <body>
            <script>
              var options = {
                "key": "${data.key}",
                "amount": "${data.amount}",
                "currency": "${data.currency}",
                "name": "ReBazaar",
                "description": "Payment",
                "image": "https://res.cloudinary.com/diocqbf72/image/upload/v1744085815/rebazaar_yim3r8.jpg",
                "order_id": "${data.id}",
                "handler": function (response){
                  window.ReactNativeWebView.postMessage(JSON.stringify({ status: 'success', response }));
                },
                "prefill": {
                  "name": "Customer",
                  "email": "customer@example.com",
                  "contact": "9999999999"
                },
                "theme": { "color": "#fed766" }
              };
              var rzp = new Razorpay(options);
              rzp.open();
            </script>
          </body>
        </html>
      `;
  
      setCheckoutHtml(html);
      setWebViewVisible(true);
    } catch (err) {
      alert('Checkout error: ' + err.message);
    }
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
      <Modal
  visible={webViewVisible}
  animationType="slide"
  presentationStyle="fullScreen"
  onRequestClose={() => setWebViewVisible(false)}
>
  <WebView
    originWhitelist={['*']}
    source={{ html: checkoutHtml }}
    style={{ flex: 1 }}
    onMessage={(event) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.status === 'success') {
          alert('Payment successful!');
          clearCart();
          setWebViewVisible(false);
        }
      } catch (error) {
        console.log('WebView message:', event.nativeEvent.data);
      }
    }}
  />
</Modal>

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
