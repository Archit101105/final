import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Footer from '../components/Footer';
import { ScrollView } from 'react-native-gesture-handler';

export function AboutUs({ navigation }){
    return(
        <ScrollView>

        <View style={styles.container}>
            <Text style={styles.text1}>
                About us
            </Text>
           <View style={styles.imgbox}> 
          <Image source={require("../assets/rebazaar.jpg")} style={styles.img}></Image>
          </View>
          <Text style={styles.text2}>
          Your local marketplace to buy and sell pre-owned goods. Discover great deals and find new homes for your used items, connecting buyers and sellers in your community.
          </Text>
          <Text style={styles.text2}>
          Buy, sell, and discover treasures in your neighborhood. Unlock value in pre-owned goods and join a community of savvy shoppers.
          </Text>
          <View style={styles.foot}>
          </View>
          <Footer navigation={navigation}/>
        </View>
        </ScrollView>   
    )
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#272727',
      height: '100%',
      width:'100%',
      alignItems:'center',
    },
 
    imgbox:{
        height:250,
        width:250,
        marginTop:20
    },

    img:{
        height:250,
        width:250,
        borderWidth:3,
        borderColor:'#fed766',
        borderRadius:15
    },

    text1:{
        color:'#fed766',
        fontSize:30,
        fontWeight:'bold',
        marginTop:"35%"
    },

    text2:{
        color:'#fed766',
        textAlign:'center',
        marginTop:35,
        fontSize:17,
        width:'75%'
    },

    foot: {
       marginTop:100
    }
});

export default AboutUs;
