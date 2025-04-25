import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image
} from 'react-native';
import { TextInput, Text, Button } from 'react-native-paper';
import { supabase } from '../lib/supabase';

const LoginScreen = function ({navigation} ) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function signInWithEmail() {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
  
      if (error) throw error;
  
      const { user } = data; // get user from login response
  
      if (!user) {
        // fallback if somehow user is null, fetch manually
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!userData.user) throw new Error('User not found after login.');
        handleNavigation(userData.user.email);
      } else {
        handleNavigation(user.email);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }
  
  function handleNavigation(userEmail) {
    if (userEmail === 'shipping.guy123@gmail.com') {
      navigation.reset({
        index: 0,
        routes: [{ name: 'ShippingGuy' }],
      });
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
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
            <Text style={styles.title}>Login to your account</Text>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
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
            onPress={signInWithEmail}
            loading={loading}
            disabled={loading}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            Sign In
          </Button>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account?</Text>
            <Button
              mode="text"
              onPress={() => navigation.navigate('SignUp')}
              labelStyle={styles.signupButtonLabel}
            >
              Sign Up
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
  error: {
    color: '#dc2626',
    textAlign: 'center',
    marginBottom: 16,
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
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  signupText: {
    color: '#FED776',
  },
  signupButtonLabel: {
    color: '#FED766',
    fontWeight: 'bold',
    marginLeft:0
  },
});

export default LoginScreen;