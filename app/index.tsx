import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import GalleryScreen from "./gallery";
import { initializeDatabase } from "@/database/database";

export default function Home() {

  useEffect(() => {
    const setupDatabase = async () => {
      try 
      {
        await initializeDatabase();  // Initialize DB on app load
        console.log('Database is ready!');
      } catch (error) {
        console.error('Error setting up the database:', error);
      }
    };

    setupDatabase();  // Call this when the app is initialized
  }, []);

  return (
    <View style={styles.container}>
      
      <GalleryScreen />

      {/* <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={() => router.replace("/camera")}
      >
        <Text style={styles.buttonText}>Take a Photo</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={() => router.push("/gallery")}
      >
        <Text style={styles.buttonText}>View Gallery</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={() => router.push("/map")}
      >
        <Text style={styles.buttonText}>View Map</Text>
      </Pressable> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 8,
  },
  buttonPressed: {
    backgroundColor: "#0056b3",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
