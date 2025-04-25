import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { TextInput, Text, Button } from 'react-native-paper';
import { supabase } from '../lib/supabase';
import { navigation } from 'react-native';

export default function SigninScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  async function signUpWithEmail() {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
        // options: {
        //   data: {
        //     username: username,
        //   },
        // },
      });

      if (error) throw error;
      Alert.alert('Success', 'Registration successful! Please check your email for verification.');
      navigation.navigate("Login");

    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/logo.jpg')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.appName}>ReBazaar</Text>
            <Text style={styles.title}>Create your account</Text>
          </View>

          {/* <TextInput
            label="Username"
            value={username}
            onChangeText={setUsername}
            mode="outlined"
            style={styles.input}
            autoCapitalize="none"
            textColor='#fed766'
            theme={{
              colors: {
                primary: '#fed766',
                text: '#fed766',
                placeholder: "#fed766",
              },
            }}
          /> */}

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            style={styles.input}
            autoCapitalize="none"
            textColor='#fed766'
            theme={{
              colors: {
                primary: '#fed766',
                text: '#fed766',
                placeholder: "#fed766",
              },
            }}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry
            style={styles.input}
            textColor='#fed766'
            theme={{
              colors: {
                primary: '#fed766',
                text: '#fed766',
                placeholder: "#fed766",
              },
            }}
          />

          <Button
            mode="contained"
            onPress={signUpWithEmail}
            loading={loading}
            disabled={loading}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            Sign Up
          </Button>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <Button
              mode="text"
              onPress={() => navigation.navigate('Login')}
              labelStyle={styles.loginButtonLabel}
            >
            Sign In
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: '#272727',
  },
  keyboardView: {
    flex: 1,
    width: "100%"
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FED776',
    textAlign: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FED776',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#272727',
  },
  button: {
    marginTop: 8,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FED766'
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black'
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  loginText: {
    color: '#FED776',
  },
  loginButtonLabel: {
    color: '#FED766',
    fontWeight: 'bold',
    marginLeft:0
  },
});