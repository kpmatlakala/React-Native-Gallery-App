import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Image, Pressable, Alert } from "react-native";
import { fetchAllImages, deleteImageById } from "@/database/database";
import Icons from "@/utils/Icons";

const GalleryScreen = () => {
  const [images, setImages] = useState([]);

  const loadImages = async () => {
    try 
    {
      const fetchedImages = await fetchAllImages();      
      setImages(fetchedImages);
    } 
    catch (error) 
    {
      console.error("Error fetching images:", error);
      Alert.alert("Error", "Failed to load gallery images.");
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  const deleteImage = async (id: number) => {
    try {
      await deleteImageById(id);
      setImages((prevImages) => prevImages.filter((img) => img.id !== id));
      Alert.alert("Success", "Image deleted successfully.");
    } catch (error) {
      console.error("Error deleting image:", error);
      Alert.alert("Error", "Failed to delete the image.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gallery App</Text>
      {images.length === 0 ? (
        <Text style={styles.message}>No photos available.</Text>
      ) : (
        <FlatList
          data={images}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.uri }} style={styles.previewImage} />
              <Text style={styles.metadata}>
                Latitude: {item.latitude}, Longitude: {item.longitude}
              </Text>
              <Pressable style={styles.deleteButton} onPress={() => deleteImage(item.id)}>
                {/* <Text style={styles.deleteText}>Delete</Text> */}
                <Icons name='delete' />
              </Pressable>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  message: {
    textAlign: "center",
    fontSize: 16,
    color: "#aaa",
  },
  imageContainer: {
    marginBottom: 16,
  },
  previewImage:{
    width: 86,
    height: 86,
    borderRadius: 8,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  metadata: {
    marginTop: 8,
    fontSize: 14,
    color: "#555",
  },
  deleteButton: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "#f44336",
    borderRadius: 4,
  },
  deleteText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default GalleryScreen;
