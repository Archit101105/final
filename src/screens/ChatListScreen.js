import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { supabase } from '../lib/supabase';
import { Alert } from 'react-native';

const ChatListScreen = ({ navigation }) => {
  const [chatList, setChatList] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    let mounted = true;
    const fetchChats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No user found');
        return;
      }
      // Fetch chat previews for current user
      const { data, error } = await supabase
        .from('chat_messages')
        .select('product_id, message, created_at, sender_id, receiver_id, products(title, user_id), sender:profiles!sender_id(username, full_name), receiver:profiles!receiver_id(username, full_name)')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });
      // console.log('Current user id:', user.id);
      // console.log('Raw chat_messages data:', data);
      if (error) console.error('Supabase error:', error);
      if (mounted && data) {
        // Group by product_id, buyer_id, seller_id, show latest message for each unique chat
        const seen = new Set();
        const chats = [];
        for (const msg of data) {
          const sellerId = msg.products.user_id;
          const buyerId = msg.sender_id === sellerId ? msg.receiver_id : msg.sender_id;
          const key = `${msg.product_id}-${buyerId}`;
          if (seen.has(key)) continue;
          seen.add(key);
          const buyerName = msg.sender_id === buyerId
            ? msg.sender.username || msg.sender.full_name || 'Buyer'
            : msg.receiver.username || msg.receiver.full_name || 'Buyer';
          const sellerName = msg.sender_id === sellerId
            ? msg.sender.username || msg.sender.full_name || 'Seller'
            : msg.receiver.username || msg.receiver.full_name || 'Seller';
          chats.push({
            productId: msg.product_id,
            productTitle: msg.products.title || 'Product',
            buyerId,
            sellerId,
            buyerName,
            sellerName,
            lastMessage: msg.message,
            lastTimestamp: msg.created_at,
          });
        }
        setChatList(chats);
      }
    };
    fetchChats();
    const unsubscribe = navigation.addListener('focus', fetchChats);
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [navigation]);

  const renderItem = ({ item }) => {
    const handlePress = () => {
      navigation.navigate('Chat', {
        product: { id: item.productId, title: item.productTitle, seller: { name: item.sellerName } },
        buyerId: item.buyerId,
        sellerId: item.sellerId,
      });
    };

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={handlePress}
      >
        <Text style={styles.title}>{item.productTitle}</Text>
        <Text style={styles.subText}>Buyer: {item.buyerName} | Seller: {item.sellerName}</Text>
        <Text style={styles.message}>{item.lastMessage}</Text>
      </TouchableOpacity>
    );
  };

  const clearAllChats = () => {
    Alert.alert(
      'Clear All Chats',
      'Are you sure you want to delete all chat history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            try {
              const { data: { user } } = await supabase.auth.getUser();
              if (!user) return;
              // Delete all chat messages where user is sender or receiver
              await supabase
                .from('chat_messages')
                .delete()
                .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);
              setChatList([]);
            } catch (e) {
              console.log('Error clearing chats:', e);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={{height:40}}>

        </View>
     
      <FlatList
        data={chatList}
        keyExtractor={item => `${item.productId}-${item.buyerId}`}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No chats yet.</Text>
        }
      />
      <TouchableOpacity onPress={clearAllChats} style={styles.clearButton}>
         <Text style={styles.clearButtonText}>Clear All Chats</Text>
      </TouchableOpacity>
 
    </View>
  );
};

export default ChatListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    padding: 10,
  },
  chatItem: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  title: {
    color: '#FED766',
    fontSize: 18,
    fontWeight: 'bold',
  },
  subText: {
    color: '#bbb',
    marginTop: 4,
  },
  message: {
    color: '#fff',
    marginTop: 6,
  },
  emptyText: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
  },

  clearButton: {
    backgroundColor: '#fed766', // button background
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  
  clearButtonText: {
    color: '#272727', 
    fontSize: 16,
    fontWeight: 'bold',
  },
  
});