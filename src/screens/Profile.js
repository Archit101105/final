import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Button } from 'react-native-paper';
import { supabase } from '../lib/supabase';
import Footer from '../components/Footer';

export default function ProfileScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);
  let [listings, setListings] = useState([]);
  const [profile, setProfile] = useState({
    username: '',
    fullName: '',
    phoneNumber: '',
    address: ''
  });

  useEffect(() => {
    checkSession();
    getProfile();
    getMyListings();
  }, []);

  const checkSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) {
      navigation.replace('Login');
    }
  };

  const getMyListings = async () => {
    try {
      setLoading(true);
      // console.log('Starting listings fetch...');
      
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        throw userError || new Error('No user logged in!');
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false });
      
      
      if (error) throw error;
      if (!Array.isArray(data)) {
        throw new Error('Expected array but got: ' + typeof data);
      }
      
      setListings(data);
      
    
      
      // console.log('Listings set successfully:', data.length, 'items');
      
        
     
      
      
    } catch (error) {
      console.error('Full error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      Alert.alert('Error', error.message || 'Failed to load listings');
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async (productId) => {
    Alert.alert(
      'Delete Listing',
      'Are you sure you want to delete this listing?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', productId);

              if (error) throw error;
              
              // Remove the deleted listing from state
              setListings(listings.filter(item => item.id !== productId));
             
              Alert.alert('Success', 'Listing deleted successfully');
            } catch (error) {
              console.error('Error deleting listing:', error.message);
              Alert.alert('Error', 'Failed to delete listing');
            }
          }
        }
      ]
    );
  };

  const getProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error('No user logged in!');

      const { data, error } = await supabase
        .from('profiles')
        .select('username, full_name, avatar_url, phone_number, location')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setProfile({
          username: data.username || '',
          fullName: data.full_name || '',
          phoneNumber: data.phone_number || '',
          address: data.location || ''
        });
        setAvatar(data.avatar_url || null);
      }
    } catch (error) {
      console.error('Error loading profile:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigation.replace('Login');
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.avatarContainer}>
          {avatar ? (
            <Image
              source={{ uri: avatar }}
              style={styles.avatar}
            />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarText}>
                {profile.username ? profile.username[0].toUpperCase() : '?'}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Username</Text>
            <Text style={styles.value}>{profile.username || 'Not set'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Full Name</Text>
            <Text style={styles.value}>{profile.fullName || 'Not set'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Phone Number</Text>
            <Text style={styles.value}>{profile.phoneNumber || 'Not set'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Address</Text>
            <Text style={styles.value}>{profile.address || 'Not set'}</Text>
          </View>
        </View>

        <Button
          mode="contained"
          onPress={() => navigation.navigate('EditProfile')}
          style={styles.editButton}
          labelStyle={styles.buttonLabel}
        >
          Edit Profile
        </Button>

        <View style={styles.listingsContainer}>
          <Text style={styles.listingsTitle}>My Listings</Text>
          {listings.length === 0 ? (
            <Text style={styles.noListingsText}>You haven't posted any listings yet</Text>
          ) : (
            listings.map((listing) => {
              const images = listing.images ? JSON.parse(listing.images) : [];
              return (
                <View key={listing.id} style={styles.listingItem}>
                  <View style={styles.listingContent}>
                    <Image 
                      source={{ uri: images[0] || null }} 
                      style={styles.listingImage}
                      defaultSource={require('../assets/placeholder.png')}
                    />
                    <View style={styles.listingDetails}>
                      <Text style={styles.listingTitle} numberOfLines={1}>{listing.title}</Text>
                      <Text style={styles.listingPrice}>₹{listing.price}</Text>
                      <Text style={styles.listingCondition}>{listing.condition}</Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => handleDeleteListing(listing.id)}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </View>

        <Button
          mode="outlined"
          onPress={signOut}
          style={styles.signOutButton}
          labelStyle={styles.signOutButtonLabel}
        >
          Sign Out
        </Button>
      </ScrollView>
      <Footer navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  listingsContainer: {
    marginTop: 10,
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 16,
    
  },
  listingsTitle: {
    color: '#FED766',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  noListingsText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  listingItem: {
    flexDirection: 'row',
    backgroundColor: '#272727',
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listingContent: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  listingImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#444',
  },
  listingDetails: {
    marginLeft: 12,
    flex: 1,
  },
  listingTitle: {
    color: '#FED766',
    fontSize: 16,
    fontWeight: '500',
  },
  listingPrice: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
  },
  listingCondition: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  deleteButton: {
    backgroundColor: '#FF4444',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 12,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  container: {
    flex: 1,
    backgroundColor: '#272727',
    
  },
  scrollView: {
    flex: 1,
    padding: 16,
    marginBottom: 100,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    backgroundColor: '#FED766',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    color: '#272727',
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  infoRow: {
    marginBottom: 16,
  },
  label: {
    color: '#888',
    fontSize: 14,
    marginBottom: 4,
  },
  value: {
    color: '#FED766',
    fontSize: 16,
    fontWeight: '500',
  },
  editButton: {
    backgroundColor: '#FED766',
    marginTop: 10,
    borderRadius: 8,
  },
  buttonLabel: {
    color: '#272727',
    fontSize: 16,
    fontWeight: '600',
  },
  signOutButton: {
    marginTop:5,
    marginBottom:50,
    
    borderColor: '#FED766',
    borderRadius: 8,
  },
  signOutButtonLabel: {
    color: '#FED766',
  },
});
