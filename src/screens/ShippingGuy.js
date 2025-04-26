import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useCart } from '../context/CartContext';

export default function ShippingGuy({ navigation }) {
  const { cartItems } = useCart();

  useEffect(() => {
    // Ensure only the shipping guy has access
    const checkAccess = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || data?.user?.email !== 'shipping.guy123@gmail.com') {
        navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
      }
    };
    checkAccess();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  const renderShippingItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.price}>₹{item.price}</Text>
    </View>
  );

  const shippingItems = cartItems.filter(item => item.shipping_opted);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Shipping Guy Dashboard</Text>
      {shippingItems.length === 0 ? (
        <Text style={styles.noShippingText}>No products with shipping option selected</Text>
      ) : (
        <FlatList
          data={shippingItems}
          keyExtractor={(item) => item.id}
          renderItem={renderShippingItem}
        />
      )}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#272727',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    color: '#FED766',
    fontWeight: '600',
    marginBottom: 20,
  },
  item: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    color: '#fff',
  },
  price: {
    fontSize: 14,
    color: '#FED766',
  },
  noShippingText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#FED766',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 20,
  },
  logoutText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});
