import React, { useState,useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { supabase } from '../lib/supabase';

import Icon from 'react-native-vector-icons/FontAwesome';
import Footer from '../components/Footer'; // Adjust the path as needed

const ChatScreen = ({ route }) => {
  const { product, buyerId, sellerId } = route.params;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [buyerUsername, setBuyerUsername] = useState('Buyer');
  const [sellerUsername, setSellerUsername] = useState('Seller');
  const [currentUserId, setCurrentUserId] = useState(null);
  const flatListRef = React.useRef(null);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      Alert.alert('Error', 'User not authenticated.');
      return;
    }
    const senderId = user.id;
    const receiverId = senderId === buyerId ? sellerId : senderId === sellerId ? buyerId : null;
    if (!receiverId) return;
    const { error } = await supabase.from('chat_messages').insert([
      {
        sender_id: senderId,
        receiver_id: receiverId,
        product_id: product.id,
        message: newMessage,
        created_at: new Date().toISOString(),
      },
    ]);
    if (!error) setNewMessage('');
    else Alert.alert('Error', 'Failed to send message.');
  };

  // Fetch usernames for both buyer and seller, and current user id
  useEffect(() => {
    const fetchUsernamesAndCurrentUser = async () => {
      // Always resolve usernames for both buyer and seller using profiles table
      const [{ data: buyerData }, { data: sellerData }, { data: { user } }] = await Promise.all([
        supabase.from('profiles').select('username, full_name').eq('id', buyerId).single(),
        supabase.from('profiles').select('username, full_name').eq('id', sellerId).single(),
        supabase.auth.getUser(),
      ]);
      if (buyerData) setBuyerUsername(buyerData.username || buyerData.full_name || 'Buyer');
      if (sellerData) setSellerUsername(sellerData.username || sellerData.full_name || 'Seller');
      if (user) setCurrentUserId(user.id);
    };
    fetchUsernamesAndCurrentUser();
  }, [buyerId, sellerId]);

  useEffect(() => {
    let subscription;
    let mounted = true;
    const fetchMessages = async () => {
      // Fetch all messages between buyer and seller for this product
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .or(`sender_id.eq.${buyerId},receiver_id.eq.${buyerId}`)
        .or(`sender_id.eq.${sellerId},receiver_id.eq.${sellerId}`)
        .eq('product_id', product.id)
        .order('created_at', { ascending: true });
      if (mounted && data) setMessages(data);
    };
    fetchMessages();
    // Real-time subscription
    subscription = supabase
      .channel('chat-messages')
      .on('postgres_changes', { event: 'INSERT', table: 'chat_messages' }, (payload) => {
        const msg = payload.new;
        // Only add messages related to this product and current chat participants
        if (
          msg.product_id === product.id &&
          ((msg.sender_id === buyerId && msg.receiver_id === sellerId) ||
           (msg.sender_id === sellerId && msg.receiver_id === buyerId))
        ) {
          setMessages((prev) => [...prev, msg]);
        }
      })
      .subscribe();
    return () => {
      mounted = false;
      supabase.removeChannel(subscription);
    };
  }, [product.id, buyerId, sellerId]);
  

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 60}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Chat with {product.seller?.name || 'Seller'} about "{product.title || 'Product'}"
        </Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          let senderName = '';
          const isCurrentUser = item.sender_id === currentUserId;
          if (item.sender_id === buyerId) senderName = buyerUsername;
          else if (item.sender_id === sellerId) senderName = sellerUsername;
          else senderName = (item.sender?.username || item.sender?.full_name || 'Unknown');
          return (
            <View
              style={[
                styles.messageBubble,
                isCurrentUser ? styles.myMessage : styles.otherMessage,
                { alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
                  backgroundColor: isCurrentUser ? '#FED766' : '#333',
                  borderTopRightRadius: isCurrentUser ? 0 : 10,
                  borderTopLeftRadius: isCurrentUser ? 10 : 0,
                }
              ]}
            >
              <Text style={[styles.messageSender, { color: isCurrentUser ? '#272727' : '#FED766' }]}>{senderName}</Text>
              <Text style={[styles.messageText, { color: isCurrentUser ? '#272727' : '#fff' }]}>{item.message}</Text>
              <Text style={[styles.messageTimestamp, { color: isCurrentUser ? '#555' : '#aaa' }]}>{new Date(item.created_at).toLocaleString()}</Text>
            </View>
          );
        }}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        style={{ flex: 1, minHeight: 0 }}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type your message..."
          placeholderTextColor="#aaa"
          multiline
          numberOfLines={2}
          minHeight={40}
          maxHeight={100}
          textAlignVertical={Platform.OS === 'ios' ? 'center' : 'top'}
          underlineColorAndroid="transparent"
          blurOnSubmit={false}
          returnKeyType="default"
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  myMessage: {
    backgroundColor: '#FED766',
    alignSelf: 'flex-end',
    borderTopRightRadius: 0,
    borderTopLeftRadius: 10,
  },
  otherMessage: {
    backgroundColor: '#333',
    alignSelf: 'flex-start',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 0,
  },
  header: {
    padding: 15,
    backgroundColor: '#FED766',
    borderBottomColor: '#333',
    borderBottomWidth: 1,
    marginTop:40
  },
  headerText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  messagesContainer: {
    padding: 10,
  },
  messageBubble: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  messageSender: {
    fontWeight: 'bold',
    color: '#FED766',
  },
  messageText: {
    color: '#fff',
    marginTop: 5,
  },
  messageTimestamp: {
    fontSize: 10,
    color: '#aaa',
    marginTop: 5,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 10,
    color: '#fff',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#FED766',
    padding: 10,
    borderRadius: 8,
  },
  sendButtonText: {
    fontWeight: 'bold',
    color: '#000',
  },
});
