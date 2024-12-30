import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Image, Pressable, Alert, Modal, ScrollView, Dimensions } from "react-native";
import { fetchAllImages, deleteImageById } from "@/database/database";
import Icons from "@/utils/Icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const GalleryScreen = () => {
  const { width, height } = Dimensions.get("window");

  const [images, setImages] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Function to load images from the database
  const loadImages = async () => {
    try {
      const fetchedImages = await fetchAllImages();
      setImages(fetchedImages);
    } catch (error) {
      console.error("Error fetching images:", error);
      Alert.alert("Error", "Failed to load gallery images.");
    }
  };

  // Load images when the component is mounted
  useEffect(() => {
    loadImages();
  }, []);

  // Function to delete an image by its id
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

  // Function to open the fullscreen image viewer
  const openImageViewer = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalVisible(true);
  };

  // Function to handle swipe gestures and update the current image index
  const handleSwipe = (direction: "left" | "right") => {
    let newIndex = currentImageIndex;
    if (direction === "left") {
      newIndex = currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1;
    } else {
      newIndex = currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1;
    }
    setCurrentImageIndex(newIndex);
  };

  // Render each item (image) in the FlatList
  const renderItem = ({ item, index }) => (
    <View style={styles.itemContainer}>
      <Pressable onPress={() => openImageViewer(index)}>
        <Image source={{ uri: item.uri }} style={styles.image} />
      </Pressable>
    </View>
  );

  return (
    <View style={[styles.container, width]}>
      <View  style={[styles.header, width]}>
        <Text style={styles.title}>
          <Icons name="image" size={22}color="black"/> Galleria 
        </Text>

        <View style={styles.topRightCornder}>
          <Pressable >
            <Icons name="camera" size={26} color="black"/>
          </Pressable>

          <Pressable>
            <Icons name="search" size={26} color="black"/>
          </Pressable>

          <Pressable>
            <Icons name="v-dots" size={26} color="black"/> 
          </Pressable>         
        </View>
      </View>


      {
        images.length === 0 ? (
          <Text style={styles.message}>No photos available.</Text>
        ) : (
          <FlatList
            data={images}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            numColumns={4} // Display images in a 4-column grid
            contentContainerStyle={styles.gridContainer} // Style for the FlatList content
          />
        )
      }

      {/* Fullscreen Image Viewer Modal */}
      <Modal visible={isModalVisible} transparent={true} animationType="fade" onRequestClose={() => setIsModalVisible(false)}>
        <GestureHandlerRootView style={styles.modalContainer}>
          {/* Image Slide Show */}
          <ScrollView
            horizontal
            pagingEnabled
            contentContainerStyle={styles.scrollViewContent}
            showsHorizontalScrollIndicator={false}
            contentOffset={{ x: currentImageIndex * 300, y: 0 }}  // Assuming image width is 300
          >
            {images.map((img, index) => (
              <View key={index} style={[styles.imageSlide, { width }]}>
                <Image source={{ uri: img.uri }} style={styles.fullscreenImage} />
              </View>
            ))}
          </ScrollView>

          {/* Close Button */}
          <Pressable style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
            <Icons name="back" size={30} color="white" />
          </Pressable>

          {/* Image Metadata and Delete Button */}
          <View style={[styles.overlay, { width }]}>
             <Text style={styles.metadata}>
              {console.log(images[currentImageIndex])}
              {/* Latitude: {images[currentImageIndex].latitude}, Longitude: {images[currentImageIndex].longitude} */}
            </Text> 

              
            {/* Swipe controls (Left & Right) */}
            <View style={styles.swipeControls}>
              {/* <Pressable onPress={() => handleSwipe("right")} style={styles.swipeButton}>
                <Text style={styles.swipeText}>{"<"}</Text>
              </Pressable> */}
              <Pressable style={styles.deleteButton} onPress={() => deleteImage(images[currentImageIndex].id)}>
                <Icons name="heart" size={25} color="white" />
              </Pressable>

              <Pressable style={styles.deleteButton} onPress={() => deleteImage(images[currentImageIndex].id)}>
                <Icons name="rename" size={25} color="white" />
              </Pressable>

              <Pressable style={styles.deleteButton} onPress={() => deleteImage(images[currentImageIndex].id)}>
                <Icons name="info" size={25} color="white" />
              </Pressable>
              
              <Pressable style={styles.deleteButton} onPress={() => deleteImage(images[currentImageIndex].id)}>
                <Icons name="delete" size={25} color="white" />
              </Pressable>
              {/* <Pressable onPress={() => handleSwipe("left")} style={styles.swipeButton}>
                <Text style={styles.swipeText}>{">"}</Text>
              </Pressable> */}
            </View>
          </View>
        </GestureHandlerRootView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  header:{
    flexDirection:"row",
    justifyContent:"space-between",
    paddingRight:16,
    marginTop:8, 
    marginBottom:16
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  topRightCornder:{
    width: "51%",
    flexDirection:"row",
    justifyContent:"space-between",
  },
  message: {
    textAlign: "center",
    fontSize: 16,
    color: "#aaa",
  },
  gridContainer: {
    flexGrow: 1,
    paddingBottom: 10, // Padding for the bottom of the list
  },
  itemContainer: {
    width: "23%", // Ensure there is space for 4 items per row (with a little margin)
    marginBottom: 16,
    marginRight: 8, // Add margin-right for spacing between columns
  },
  image: {
    width: "100%", // Make the image take up the full width of the item container
    aspectRatio: 1, // Maintain a square aspect ratio for the images
    borderRadius: 8,
  },
  modalContainer: {
    position: "absolute",
    top:0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(20, 20, 20, 0.98)", // Background overlay
    padding: 0,
  },
  scrollViewContent: 
  {
    flexDirection: "row", 
    alignSelf:"center",
  },
  imageSlide: {
    borderColor:"rgba(255, 255, 255, 0.8)",
    borderWidth: 1,
    width: "100svw", // Image width for sliding
    // height: 300, // Image height
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 0, // Ensure the image is horizontally centered within the container
    flex: 1, // Ensure that imageSlide takes up all available space
  },
  fullscreenImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    resizeMode: "contain", // Ensure image aspect ratio is preserved
  },
  overlay: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20
    // width: "100%",
  },
  metadata: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginBottom: 16,
  },
  deleteButton: {
    padding: 12,
    backgroundColor: "#f44336", // Red background for the delete button
    borderRadius: 8,
    marginBottom: 20,
  },
  swipeControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  swipeButton: {
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 20,
  },
  swipeText: {
    color: "#fff",
    fontSize: 20,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    left: 20,
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 20,
  },
});

export default GalleryScreen;
