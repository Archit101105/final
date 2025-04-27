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
  RefreshControl,
} from 'react-native';
import { supabase } from '../lib/supabase';
import Footer from '../components/Footer';

const { width, height } = Dimensions.get('window');

const GamesScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const getProducts = async () => {
    try {
      setLoading(true);
      console.log('Fetching games products...');
      
      const { data, error } = await supabase
        .from('products')
        .select('*, profiles:user_id(*)')
        .eq('category', 'games')
        .order('created_at', { ascending: false })
        .eq('is_ordered', false);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Found games products:', data?.length || 0);
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching games:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.title?.toLowerCase().includes(search.toLowerCase()) ||
    product.description?.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }) => {
    const imageUrl = item.images && item.images[0];

    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => navigation.navigate('ProductDetails', { product: item })}
      >
        <Image 
          source={imageUrl ? { uri: imageUrl } : require('../assets/placeholder.png')} 
          style={styles.productImage} 
        />
        <View style={styles.productInfo}>
          <Text style={styles.productTitle}>{item.title}</Text>
          <Text style={styles.productPrice}>₹{item.price}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#FED766" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search games..."
        placeholderTextColor="#999"
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.productList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <Footer navigation={navigation} />
    </View>
  );
};

export default GamesScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#424549',
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    backgroundColor: '#2F3136',
    borderRadius: 8,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#1e2124',
    width: (width - 40) / 2,
    height: height * 0.3, // 2/5 of screen height
    borderRadius: 10,
    borderColor: '#FED766',
    borderWidth: 1,
    padding: 10,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '80%',
    resizeMode: 'cover',
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    color: '#fed766',
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  price: {
    fontSize: 14,
    color: '#118C4F',
    marginTop: 4,
    textAlign: 'center',
  },
});