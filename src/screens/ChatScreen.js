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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Icon from 'react-native-vector-icons/FontAwesome';
import Footer from '../components/Footer'; // Adjust the path as needed

const ChatScreen = ({ route }) => {
  const { product } = route.params;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = async () => {
    if (newMessage.trim() !== '') {
      const message = {
        id: Date.now().toString(),
        text: newMessage,
        sender: 'You',
        timestamp: new Date().toISOString(),
      };
  
      const updatedMessages = [...messages, message];
      setMessages(updatedMessages);
      setNewMessage('');
  
      // Save to AsyncStorage
      await AsyncStorage.setItem(
        `chat_${product.id}`, // key per product
        JSON.stringify(updatedMessages)
      );
  
      // Update global chat list
      const chatPreview = {
        productId: product.id,
        productTitle: product.title || 'Product',
        sellerName: product.seller?.name || 'Seller',
        lastMessage: message.text,
        lastTimestamp: message.timestamp,
      };
  
      const chatListRaw = await AsyncStorage.getItem('chat_list');
      let chatList = chatListRaw ? JSON.parse(chatListRaw) : [];
  
      // Remove if already exists (avoid duplicates)
      chatList = chatList.filter(c => c.productId !== product.id);
      chatList.unshift(chatPreview); // add new chat to top
  
      await AsyncStorage.setItem('chat_list', JSON.stringify(chatList));
    }

    
    
  };

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const stored = await AsyncStorage.getItem(`chat_${product.id}`);
        if (stored) {
          setMessages(JSON.parse(stored));
        }
      } catch (e) {
        console.log('Error loading messages:', e);
      }
    };
  
    loadMessages();
  }, [product.id]); 
  

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Chat with {product.seller?.name || 'Seller'} about "{product.title || 'Product'}"
        </Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.messageBubble}>
            <Text style={styles.messageSender}>{item.sender}</Text>
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.messageTimestamp}>{item.timestamp}</Text>
          </View>
        )}
        contentContainerStyle={styles.messagesContainer}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type your message..."
          placeholderTextColor="#aaa"
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
