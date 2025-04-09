import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Footer({ navigation }) {
  return (
    <View style={styles.footer}>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Ionicons name="home" size={24} color="#FED766" />
      </TouchableOpacity>



      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => navigation.navigate('ChatList')}
      >
        <Ionicons name="chatbubbles" size={24} color="#FED766" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => navigation.navigate('AddProduct')}
      >
        <Ionicons name="add-circle" size={24} color="#FED766" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => navigation.navigate('Profile')}
      >
        <Ionicons name="person" size={24} color="#FED766" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => navigation.navigate('AboutUs')}
      >
        <Ionicons name="information-circle" size={24} color="#FED766" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1a1a1a',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  iconButton: {
    padding: 8,
  },
});
