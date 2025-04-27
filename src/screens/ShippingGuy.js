import { supabase } from '../lib/supabase';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function ShippingGuy({ navigation }) {
  const [shippingItems, setShippingItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusOptions = ['Order Placed', 'Dispatched', 'Out for Delivery', 'Delivered'];

  useEffect(() => {
    fetchShippingItems();
  }, []);

  const fetchShippingItems = async () => {
    setLoading(true);
    try {
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          id, title, price, images, shipping_status,
          user_id,
          buyer_id,
          seller_profile: user_id ( username, phone_number ),
          buyer_profile: buyer_id ( username, phone_number )
        `)
        .eq('shipping_opted', true);
  
      if (productsError) {
        console.error('Error fetching shipping items:', productsError.message);
        return;
      }
  
      const userIds = [
        ...new Set(productsData.flatMap(item => [item.user_id, item.buyer_id]))
      ].filter(Boolean);
  
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, location')
        .in('id', userIds);
  
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError.message);
        return;
      }
  
      const profileMap = {};
      profilesData.forEach(profile => {
        profileMap[profile.id] = profile.location;
      });
  
      const enrichedProducts = productsData.map(product => ({
        ...product,
        seller_location: profileMap[product.user_id] || 'Unknown',
        buyer_location: profileMap[product.buyer_id] || 'Unknown',
      }));
  
      setShippingItems(enrichedProducts);
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  

  const updateShippingStatus = async (productId, newStatus) => {
    const { error } = await supabase
      .from('products')
      .update({ shipping_status: newStatus })
      .eq('id', productId);

    if (error) {
      Alert.alert('Error', 'Failed to update shipping status');
    } else {
      fetchShippingItems(); // refresh list
    }
  };

  const clearOrder = async (productId) => {
    const { error } = await supabase
      .from('products')
      .update({ shipping_opted: false, shipping_status: null })
      .eq('id', productId);

    if (error) {
      Alert.alert('Error', 'Failed to clear order');
    } else {
      fetchShippingItems(); // refresh list
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigation.navigate('Login');
    } catch (err) {
      console.error('Error logging out:', err.message);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
        <ActivityIndicator size="large" color="#fed766" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: 'black', paddingBottom: 59 }}>
      <Text style={{ color: '#fed766', fontSize: 24, fontWeight: 'bold', marginBottom: 16, marginTop: 20 }}>
        Shipping Orders
      </Text>

      {shippingItems.length === 0 ? (
        <Text style={{ color: '#fff' }}>No shipping orders yet.</Text>
      ) : (
        <FlatList
          data={shippingItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            let imageUri = '';
            try {
              const imageArray = JSON.parse(item.images);
              imageUri = imageArray[0];
            } catch (e) {
              console.warn('Error parsing image URL:', e);
            }

            return (
              <View
                style={{
                  backgroundColor: '#1a1a1a',
                  padding: 16,
                  marginBottom: 12,
                  borderRadius: 12,
                  borderColor: '#fed766',
                  borderWidth: 1,
                }}
              >
                {imageUri ? (
                  <Image
                    source={{ uri: imageUri }}
                    style={{ height: 180, borderRadius: 8, marginBottom: 12 }}
                    resizeMode="cover"
                  />
                ) : null}

                <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>{item.title}</Text>
                <Text style={{ color: '#ccc', marginBottom: 8 }}>Price: ₹{item.price}</Text>

                {/* Seller & Buyer Info Row */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                  {/* Seller */}
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={{ color: '#fed766', fontWeight: 'bold' }}>Seller</Text>
                    <Text style={{ color: '#fff' }}>Name: {item.seller_profile?.username ?? 'Unknown'}</Text>
                    <Text style={{ color: '#fff' }}>Phone: {item.seller_profile?.phone_number ?? 'Unknown'}</Text>
                    <Text style={{ color: '#fff' }}>
                      Address: {item.seller_location}
                    </Text>

                  </View>

                  {/* Buyer */}
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={{ color: '#fed766', fontWeight: 'bold' }}>Buyer</Text>
                    <Text style={{ color: '#fff' }}>Name: {item.buyer_profile?.username ?? 'Unknown'}</Text>
                    <Text style={{ color: '#fff' }}>Phone: {item.buyer_profile?.phone_number ?? 'Unknown'}</Text>
                    <Text style={{ color: '#fff' }}>
                      Address: {item.buyer_location}
                    </Text>

                  </View>
                </View>

                {/* Shipping Status Picker */}
                <View style={{ marginTop: 12 }}>
                  <Text style={{ color: '#fed766', fontWeight: 'bold' }}>Shipping Status</Text>
                  <Picker
                    selectedValue={item.shipping_status || 'Order Placed'}
                    dropdownIconColor="#fed766"
                    style={{
                      color: '#fff',
                      backgroundColor: '#333',
                      borderRadius: 8,
                      marginTop: 4,
                    }}
                    onValueChange={(value) => updateShippingStatus(item.id, value)}
                  >
                    {statusOptions.map((status) => (
                      <Picker.Item key={status} label={status} value={status} />
                    ))}
                  </Picker>
                </View>

                {/* Clear Button */}
                {item.shipping_status === 'Delivered' && (
                  <TouchableOpacity
                    onPress={() => clearOrder(item.id)}
                    style={{
                      marginTop: 12,
                      paddingVertical: 10,
                      backgroundColor: '#ff4d4d',
                      borderRadius: 8,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Clear Order</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          }}
        />
      )}

      {/* Logout Button */}
      <View style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            backgroundColor: '#fed766',
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'black', fontSize: 16, fontWeight: 'bold' }}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
