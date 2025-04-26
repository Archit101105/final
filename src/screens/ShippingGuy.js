import { supabase } from '../lib/supabase'; // Adjust path if needed
import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';

export default function ShippingGuy({ navigation }) {
  const [shippingItems, setShippingItems] = useState([]);
  const [user, setUser] = useState(null); // To store the logged-in user's data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShippingItems();
    fetchUser();
  }, []);

  const fetchShippingItems = async () => {
    try {
      const { data, error } = await supabase
  .from('products')
  .select(`
    id,
    title,
    price,
    seller_profile: user_id ( username, phone_number ),
    buyer_profile: buyer_id ( username, phone_number )
  `)
   // `profiles(username)` will pull the username from profiles based on buyer_id
  .eq('shipping_opted', true);

  
      if (error) {
        console.error('Error fetching shipping items:', error.message);
      } else {
        setShippingItems(data);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  
  

  const fetchUser = async () => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser(); // Get the current logged-in user
  
      // Log the entire user data to see its structure
      console.log('User data from supabase.auth.getUser():', userData);
      
      if (userError) {
        console.error('Error fetching user:', userError.message);
      } else if (userData?.user) {
        // Fetch the username from the profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('username','phone_number') // Fetch the username from the profiles table
          .eq('id', userData.user.id) // Use the logged-in user's id
          .single(); // Ensure we get only one profile
  
        // Log the profile data to check the response
        console.log('Profile data from profiles table:', profileData);
  
        if (profileError) {
          console.error('Error fetching user profile:', profileError.message);
        } else {
          if (profileData) {
            setUser(profileData); // Set the user data (username) in the state
          } else {
            console.log('No profile data found for user.');
          }
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };
  
  /*const clearShippingList = async () => {
    try {
      // Delete all items from the database where shipping_opted is true
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('shipping_opted', true); // This will delete all items with shipping_opted = true
  
      if (error) {
        console.error('Error deleting shipping items:', error.message);
      } else {
        console.log('Shipping items successfully deleted from the database');
        setShippingItems([]); // Clear the shipping items from the UI
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };*/
  
  

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut(); // Sign out the user
      navigation.navigate('Login'); // Navigate to Login screen
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

  // Log shippingItems and user data for debugging
  console.log('Shipping items:', shippingItems);
  console.log('User data:', user);

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: 'black' }}>
      <Text style={{ color: '#fed766', fontSize: 24, fontWeight: 'bold', marginBottom: 16,marginTop:20 }}>Shipping Orders</Text>

      {shippingItems.length === 0 ? (
        <Text style={{ color: '#fff' }}>No shipping orders yet.</Text>
      ) : (
        <FlatList
          data={shippingItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={{ padding: 16, marginBottom: 8, borderWidth: 1, borderColor: '#fed766', borderRadius: 8 }}>
              <Text style={{ color: '#fff', fontWeight: '600' }}>{item.title}</Text>
              <Text style={{ color: '#fff' }}>Price: ₹{item.price}</Text>
              <Text style={{ color: '#fff', marginTop: 8 }}>
              <Text>Seller: {item.seller_profile?.username ?? 'Unknown'}</Text>{'\n'}
              <Text>Seller phone no.: {item.seller_profile?.phone_number ?? 'Unknown'}</Text>{'\n'}
              <Text>Buyer: {item.buyer_profile?.username ?? 'Unknown'}</Text>{'\n'}
              <Text>Buyer phone no.: {item.buyer_profile?.phone_number ?? 'Unknown'}</Text>
             </Text>

            </View>
          )}
        />
      )}

{/*<View style={{ position: 'absolute', bottom: 80, left: 16, right: 16 }}>
        <TouchableOpacity
          onPress={clearShippingList}
          style={{
            backgroundColor: '#ff7f50', // Button background color (red for delete)
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'black', fontSize: 16, fontWeight: 'bold' }}>Clear Shipping List</Text>
        </TouchableOpacity>
      </View>*/}

      {/* Custom Logout Button */}
      <View style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
        <TouchableOpacity 
          onPress={handleLogout}
          style={{
            backgroundColor: '#fed766', // Button background color
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
