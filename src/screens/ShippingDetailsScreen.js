import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image, ScrollView } from 'react-native';
import { supabase } from '../lib/supabase';

const ShippingDetailsScreen = ({ route }) => {
  const { productId } = route?.params || {};
  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (!productId) {
          setError('No product ID provided');
          setLoading(false);
          return;
        }

        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();

        if (productError) {
          setError(productError.message);
          setLoading(false);
          return;
        }

        setProduct(productData);

        if (productData?.user_id) {
          const { data: sellerData, error: sellerError } = await supabase
            .from('profiles')
            .select('full_name, phone_number') // select phone_number too
            .eq('id', productData.user_id)
            .single();

          if (sellerError) {
            console.log('Error fetching seller:', sellerError.message);
          } else {
            setSeller(sellerData);
          }
        }
      } catch (err) {
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [productId]);

  const getImage = () => {
    try {
      if (typeof product?.images === 'string') {
        const parsed = JSON.parse(product.images);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed[0];
        }
      }
    } catch (e) {
      console.error('Error parsing image:', e);
    }
    return null;
  };

  const productImage = getImage();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FED766" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        {productImage ? (
          <Image source={{ uri: productImage }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.image, styles.placeholder]}>
            <Text style={styles.placeholderText}>No Image Available</Text>
          </View>
        )}
      </View>

      <View style={styles.detailsContainer}>
        {/* Product Title */}
        <Text style={styles.productTitle}>{product?.title}</Text>

        {/* Shipping Status */}
        <View style={styles.statusTile}>
          <Text style={styles.statusTitle}>Shipping Status :</Text>
          <Text style={[
            styles.shippingStatusText,
            { color: product.shipping_status === 'Delivered' ? '#34D399' : '#FED766' }
          ]}>
            {product?.shipping_status || 'Shipping'}
          </Text>
        </View>

        {/* Product Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Product Details</Text>
          <Text style={styles.text}>Price: ${product?.price || 'N/A'}</Text>
          <Text style={styles.text}>Condition: {product?.condition || 'N/A'}</Text>
          <Text style={styles.text}>Description:</Text>
          <Text style={[styles.text, { marginTop: 4 }]}>{product?.description || 'No description available.'}</Text>
        </View>

        {/* Seller Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seller Information</Text>
          <Text style={styles.text}>Full Name: {seller?.full_name || 'Unknown'}</Text>
          <Text style={styles.text}>Phone: {seller?.phone_number || 'N/A'}</Text>
        </View>

        {/* Shipping Company Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Company</Text>
          <Text style={styles.text}>Company: FastShip Logistics</Text>
          <Text style={styles.text}>Support: support@fastship.com</Text>
          <Text style={styles.text}>Contact: +1 234 567 8900</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default ShippingDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
  },
  imageContainer: {
    width: '100%',
    height: 250,
    backgroundColor: '#333',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#555',
  },
  placeholderText: {
    color: '#ccc',
    fontSize: 16,
  },
  detailsContainer: {
    padding: 20,
  },
  productTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FED766',
    textAlign: 'center',
    marginBottom: 20,
  },
  statusTile: {
    backgroundColor: '#111',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  statusTitle: {
    fontSize: 15,
    color: '#FED766',
    marginBottom: 10,
    fontWeight: '600',
    letterSpacing: 1.5,
  },
  shippingStatusText: {
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1.5, // <-- ADDED letterSpacing
  },
  section: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FED766',
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 5,
    lineHeight: 22,
  },
});
