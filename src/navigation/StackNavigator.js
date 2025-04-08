import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/loginScreen";
import SignUpScreen from "../screens/signinScreen";
import ProfileScreen from "../screens/Profile";
import AddProductScreen from "../screens/AddProductScreen";
import ProductDetailsScreen from "../screens/ProductDetailsScreen";
import CartScreen from "../screens/CartScreen";
import ChatListScreen from "../screens/ChatListScreen";
import ChatScreen from "../screens/ChatScreen";
import CarScreen from "../screens/CarScreen";
import CameraScreen from "../screens/CameraScreen";
import GamesScreen from "../screens/GamesScreen";
import HeadphonesScreen from "../screens/HeadphonesScreen";
import MobileScreen from "../screens/MobileScreen";
import TVScreen from "../screens/TVScreen";
import RealEstateScreen from "../screens/RealEstateScreen";
import OthersScreen from "../screens/OthersScreen";
import EditProfile from "../screens/EditProfile";
import ProfileSetUp from "../screens/ProfileSetUp";
import FullImageScreen from "../screens/FullImageScreen";
import AboutUs from "../screens/AboutUs";
const Stack = createStackNavigator();

export default function StackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#272727',
          },
          headerTintColor: '#FED766',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{headerShown:false}} 
        />
        <Stack.Screen 
          name="SignUp" 
          component={SignUpScreen} 
          options={{headerShown:false}} 
        />
        <Stack.Screen
          name="ProductDetails"
          component={ProductDetailsScreen}
          options={{
            title: 'Product Details',
            headerShown: true
          }}
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{headerShown:false}} 
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{
            title: 'My Profile',
            headerLeft: null,
          }} 
        />
        <Stack.Screen 
          name="AddProduct" 
          component={AddProductScreen} 
          options={{title: 'Add New Listing'}} 
        />

        <Stack.Screen 
          name="Cart" 
          component={CartScreen} 
          options={{title: 'My Cart'}} 
        />
        <Stack.Screen 
          name="ChatList" 
          component={ChatListScreen} 
          options={{title: 'Messages'}} 
        />
        <Stack.Screen 
          name="Chat" 
          component={ChatScreen} 
          options={{title: 'Chat'}} 
        />

        <Stack.Screen 
          name="Cars" 
          component={CarScreen} 
          options={{title: 'Cars'}} 
        />
        <Stack.Screen 
          name="Cameras" 
          component={CameraScreen} 
          options={{title: 'Cameras'}} 
        />
        <Stack.Screen 
          name="Games" 
          component={GamesScreen} 
          options={{title: 'Games'}} 
        />
        <Stack.Screen 
          name="Headphones" 
          component={HeadphonesScreen} 
          options={{title: 'Headphones'}} 
        />
        <Stack.Screen
          name="FullImage"
          component={FullImageScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Mobiles" 
          component={MobileScreen} 
          options={{title: 'Mobile Phones'}} 
        />
        <Stack.Screen 
          name="TVs" 
          component={TVScreen} 
          options={{title: 'TVs'}} 
        />
        <Stack.Screen 
          name="RealEstate" 
          component={RealEstateScreen} 
          options={{title: 'Real Estate'}} 
        />
        <Stack.Screen 
          name="Others" 
          component={OthersScreen} 
          options={{title: 'Others'}} 
        />
        <Stack.Screen 
          name="ProfileSetUp" 
          component={ProfileSetUp} 
          options={{
            title: 'Complete Profile',
            headerLeft: null
          }} 
        />
        <Stack.Screen 
          name="EditProfile" 
          component={EditProfile} 
          options={{
            title: 'Edit Profile',
            headerStyle: {
              backgroundColor: '#272727',
            },
            headerTintColor: '#FED766',
            headerTitleStyle: {
              color: '#FED766',
            },
          }} 
        />
        <Stack.Screen 
          name="AboutUs" 
          component={AboutUs} 
          options={{title: 'About Us'}} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
