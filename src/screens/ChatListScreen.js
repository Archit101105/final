import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Button } from 'react-native';

const ChatListScreen = ({ navigation }) => {
  const [chatList, setChatList] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      const data = await AsyncStorage.getItem('chat_list');
      if (data) {
        setChatList(JSON.parse(data));
      }
    };

    const unsubscribe = navigation.addListener('focus', fetchChats);
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => navigation.navigate('Chat', { product: {
        id: item.productId,
        title: item.productTitle,
        seller: { name: item.sellerName }
      } })}
    >
      <Text style={styles.title}>{item.productTitle}</Text>
      <Text style={styles.subText}>Seller: {item.sellerName}</Text>
      <Text style={styles.message}>{item.lastMessage}</Text>
    </TouchableOpacity>
  );

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
              const keys = await AsyncStorage.getAllKeys();
              const chatKeys = keys.filter(key => key.startsWith('chat_'));
              await AsyncStorage.multiRemove(chatKeys);
              await AsyncStorage.removeItem('chat_list');
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
        keyExtractor={item => item.productId.toString()}
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