import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  Dimensions,
} from 'react-native';
import { supabase } from '../lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import Footer from '../components/Footer';
import styles from '../styles';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Map display categories to database categories
  const categoryMap = {
    'Mobile': 'mobile',
    'TV': 'tv',
    'Cars': 'car',
    'Bikes': 'bike',
    'Headphones': 'headphones',
    'Cameras': 'cameras',
    'Real Estate': 'realestate',
    'Games': 'games',
    'Others': 'others'
  };

  const categories = [
    { name: 'All', backgroundColor: '#424549', icon: 'th-large', screen: 'All' },
    { name: 'Cars', icon: 'car', screen: 'Cars' },
    { name: 'Bikes', icon: 'motorcycle', screen: 'Bikes' },
    { name: 'Mobile', icon: 'mobile', screen: 'Mobiles' },
    { name: 'TV', icon: 'television', screen: 'TVs' },
    { name: 'Games', icon: 'gamepad', screen: 'Games' },
    { name: 'Cameras', icon: 'camera', screen: 'Cameras' },
    { name: 'Headphones', icon: 'headphones', screen: 'Headphones' },
    { name: 'Real Estate', icon: 'home', screen: 'RealEstate' },
    { name: 'Others', icon: 'ellipsis-h', screen: 'Others' },
  ];

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      setLoading(true);
      console.log('Fetching products...');
      const { data, error } = await supabase
        .from('products')
        .select('*, profiles:user_id(*)')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      // console.log('Products fetched:', JSON.stringify(data, null, 2));
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error.message);
      Alert.alert('Error', 'Failed to fetch products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
  };

  const filteredProducts = products.filter(product => {
    const titleMatch = product.title?.toLowerCase().includes(search.toLowerCase()) || false;
    const descriptionMatch = product.description?.toLowerCase().includes(search.toLowerCase()) || false;
    const searchMatch = search.trim() === '' || titleMatch || descriptionMatch;

    const databaseCategory = categoryMap[selectedCategory];
    const categoryMatch = !selectedCategory || selectedCategory === 'All' ||
      product.category === databaseCategory;

    return searchMatch && categoryMatch;
  });

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

  const renderProductItem = ({ item }) => {
    if (!item) return null;

    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => navigation.navigate('ProductDetails', { product: item })}
      >
        {getImageUrl(item.images) ? (
          <Image
            source={{ uri: getImageUrl(item.images) }}
            style={styles.productImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.productImage, styles.noImage]}>
            <Text style={styles.noImageText}>No Image</Text>
          </View>
        )}
        <View style={styles.productInfo}>
          <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.productPrice}>₹{item.price}</Text>
          <Text style={styles.productCategory}>{item.category}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.header}>
        {/* Search Bar */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#fed766" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={`Search ${selectedCategory || 'products'}...`}
            placeholderTextColor="#fed766"
            value={search}
            onChangeText={handleSearch}
          />
          
        </View>
        <TouchableOpacity
            style={styles.cartButton}
            onPress={() => navigation.navigate('Cart')}
          >
            <Ionicons name="cart" size={24} color="#FED766" />
          </TouchableOpacity>

        </View>
        
        {/* Categories */}
        <View style={styles.categoriesContainer}>
          {/* First Row */}
          <View style={styles.categoryRow}>
            {categories.slice(0, 5).map((category, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.categoryItem,
                  selectedCategory === category.name && styles.selectedCategory
                ]}
                onPress={() => {
                  setSelectedCategory(
                    selectedCategory === category.name ? null : category.name
                  );
                  setSearch(''); // Clear search when category changes
                }}
              >
                <Icon 
                  name={category.icon} 
                  size={24} 
                  color={selectedCategory === category.name ? '#000000' : '#fed766'} 
                />
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Second Row */}
          <View style={styles.categoryRow}>
            {categories.slice(5).map((category, index) => (
              <TouchableOpacity
                key={index + 5}
                style={[
                  styles.categoryItem,
                  selectedCategory === category.name && styles.selectedCategory
                ]}
                onPress={() => {
                  setSelectedCategory(
                    selectedCategory === category.name ? null : category.name
                  );
                  setSearch(''); // Clear search when category changes
                }}
              >
                <Icon 
                  name={category.icon} 
                  size={24} 
                  color={selectedCategory === category.name ? '#000000' : '#fed766'} 
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Products List */}
      <View style={styles.contentContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FED766" />
          </View>
        ) : (
          <FlatList
            data={filteredProducts}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            style={styles.productList}
            contentContainerStyle={styles.productListContent}
            showsVerticalScrollIndicator={false}
            getItemLayout={(data, index) => ({
              length: 250, // Approximate height of each item
              offset: 250 * Math.floor(index / 2), // Account for 2 columns
              index,
            })}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No products found</Text>
                <TouchableOpacity onPress={getProducts} style={styles.refreshButton}>
                  <Text style={styles.refreshButtonText}>Refresh</Text>
                </TouchableOpacity>
              </View>
            }
            onRefresh={getProducts}
            refreshing={loading}
          />
        )}
      </View>
      <View style={{
        height: 70
      }}>

      </View>

      <Footer navigation={navigation} />
    </SafeAreaView>
  );
};

export default HomeScreen;
