import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { supabase } from "../lib/supabase";

export default function ShippingGuy({ navigation }) {
  useEffect(() => {
    const checkAccess = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || data?.user?.email !== "shipping.guy123@gmail.com") {
        navigation.reset({ index: 0, routes: [{ name: "Home" }] });
      }
    };
    checkAccess();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Add more content here if needed */}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#272727",
    justifyContent: "space-between",
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#FED766",
    fontSize: 20,
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#FED766",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  logoutText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
});
