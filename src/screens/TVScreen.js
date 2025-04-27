import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '../lib/supabase';
import Footer from '../components/Footer';

const { width, height } = Dimensions.get('window');

const TVScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*, profiles:user_id(*)')
        .eq('category', 'tv')
        .order('created_at', { ascending: false })
        .eq('is_ordered', false);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching TVs:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
    >
      <Image 
        source={{ uri: item.images ? JSON.parse(item.images)[0] : null }} 
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.price}>₹{item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search TVs..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#666"
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FED766" />
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.productList}
          refreshing={loading}
          onRefresh={getProducts}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No TVs found</Text>
            </View>
          }
        />
      )}

      <Footer navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#424549',
    flex: 1,
    paddingHorizontal: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    color: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productList: {
    paddingVertical: 10,
  },
  card: {
    flex: 1,
    backgroundColor: '#1e2124',
    margin: 6,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    maxWidth: width / 2 - 12,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fed766',
    marginHorizontal: 8,
    marginTop: 8,
  },
  price: {
    fontSize: 14,
    color: '#118C4F',
    marginHorizontal: 8,
    marginVertical: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    color: '#fed766',
    fontSize: 16,
  },
});

export default TVScreen;