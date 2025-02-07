import Icons from "@/utils/Icons";
import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, FlatList, Image, Pressable, Alert, Modal, Dimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import CameraScreen from "./camera";
import { fetchAllImages, deleteImageById } from "@/database/database";
import ImageInfoModal from "@/components/ImageInfoModal";



const GalleryScreen = () => {
  const { width, height } = Dimensions.get("window");
  const [isCameraVisible, setIsCameraVisible] = useState(false);

  const [images, setImages] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isImageInfoVisible, setIsImageInfoVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Tracks the currently viewed image index
  const [slide, setSlide] = useState(1); // Slide (1-based index) to display on the modal
  const [prevDisabled, setPrevDisabled] = useState(false); // Disable prev button on first image
  const [nextDisabled, setNextDisabled] = useState(false); // Disable next button on last image

  const flatlistRef = useRef(null);

  // Function to load images from the database
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

  // Load images when the component is mounted
  useEffect(() => {
    loadImages();
  }, []);

  const toggleCameraModal = () => {
    setIsCameraVisible((prev) => !prev);
    if(isCameraVisible) refreshImages();
  };
  // Refresh images after taking a photo
  const refreshImages = () => {
    loadImages();  // Reload the images from the database
  };

  // Function to delete an image by its id
  const deleteImage = async (id) => {
    try 
    {
      await deleteImageById(id);
      setImages((prevImages) => prevImages.filter((img) => img.id !== id));
      Alert.alert("Success", "Image deleted successfully.");
    } 
    catch (error) 
    {
      console.error("Error deleting image:", error);
      Alert.alert("Error", "Failed to delete the image.");
    }
  };

  // Function to open the fullscreen image viewer
  const openImageViewer = (index) => {
    setCurrentImageIndex(index);
    setSlide(index + 1); // Update slide position (1-based index)
    setIsModalVisible(true);

    // Ensure the FlatList scrolls to the selected image
    if (flatlistRef.current) {
      flatlistRef.current.scrollToIndex({ index, animated: true });
    }
  };

  // Handle next and previous slide navigation
  const onPrevious = () => {
    if (currentImageIndex === 0) return; // Do nothing if we're on the first image
    const newIndex = currentImageIndex - 1;
    setCurrentImageIndex(newIndex);
    setSlide(newIndex + 1); // Update slide position
    flatlistRef.current.scrollToIndex({ index: newIndex, animated: true });
  };

  const onNext = () => {
    if (currentImageIndex === images.length - 1) return; // Do nothing if we're on the last image
    const newIndex = currentImageIndex + 1;
    setCurrentImageIndex(newIndex);
    setSlide(newIndex + 1); // Update slide position
    flatlistRef.current.scrollToIndex({ index: newIndex, animated: true });
  };

  // Define the getItemLayout function for horizontal FlatList
  const getItemLayout = (data, index) => ({
    length: width,  // Each item has the same width as the screen
    offset: width * index, // Offset based on the current index
    index,  // The current index of the item
  });

  // Handle failed scrollToIndex attempts
  const onScrollToIndexFailed = (error) => {
    const contentOffsetX = error.averageItemLength * error.index;
    flatlistRef.current.scrollToOffset({ offset: contentOffsetX, animated: true });
  };

  // Handle the scroll event to keep the image index synced
  const onScroll = (e) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const newIndex = Math.floor(offsetX / width);

    // Update the index and slide number
    setCurrentImageIndex(newIndex);
    setSlide(newIndex + 1);

    // Disable buttons based on position
    setPrevDisabled(newIndex === 0);
    setNextDisabled(newIndex === images.length - 1);
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          <Icons name="image" size={22} color="black" /> Galleria
        </Text>

        <View style={styles.topRightCornder}>
          <Pressable onPress={toggleCameraModal}>
            <Icons name="camera" size={26} color="black" />
          </Pressable>

          <Pressable>
            <Icons name="search" size={26} color="black" />
          </Pressable>

          <Pressable>
            <Icons name="v-dots" size={26} color="black" />
          </Pressable>
        </View>
      </View>

      <Modal visible={isCameraVisible} transparent={true} animationType="slide" onRequestClose={toggleCameraModal}>
        <CameraScreen onClose={toggleCameraModal} onImageCaptured={refreshImages} />
      </Modal>

      {/* Fullscreen Image Viewer Modal */}
      <Modal visible={isModalVisible} transparent={true} animationType="fade" 
         onRequestClose={() => {
          setIsModalVisible(false);
          setCurrentImageIndex(0); // Reset to the first image when the modal is closed
          setSlide(1); // Reset the slide to 1 (1-based index)
        }}
      >
        <GestureHandlerRootView style={styles.modalContainer}>
          {images && (
            <FlatList
              ref={flatlistRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={width}
              snapToAlignment="center"
              decelerationRate="fast"
              pagingEnabled={true}
              data={images}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={{ width: width, height: height, justifyContent: "center", alignItems: "center" }}>
                  <Image source={{ uri: item.uri }} style={{ width: "98%", height: height, resizeMode: "contain" }} />
                </View>
              )}
              getItemLayout={getItemLayout}  // Provide the layout info for the FlatList
              onScrollToIndexFailed={onScrollToIndexFailed}  // Handle failed scroll attempts
              onScroll={onScroll}  // Handle scroll position updates
              scrollEventThrottle={16}
              initialScrollIndex={currentImageIndex} // Start at the correct index when modal opens
            />
          )}

          {/* Close Button */}
          <Pressable style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
            <Icons name="back" size={30} color="white" />
          </Pressable>

          {/* Image Metadata and Controls */}
          <View style={styles.overlay}>
            <Text style={styles.metadata}>{images[currentImageIndex]?.id}</Text>

            <View style={styles.swipeControls}>
              <Pressable onPress={onPrevious} disabled={prevDisabled} 
                style={({ pressed }) => [{ opacity: pressed || prevDisabled ? 0.5 : 1 }]}>
                <Icons name="left-arrow" size={30} color="white" />
              </Pressable>

              <Pressable style={styles.favButton} onPress={() => alert("add to faves")}>
                <Icons name="heart" size={25} color="white" />
              </Pressable>

              <Pressable style={styles.midButton} onPress={() => alert("edit the image")}>
                <Icons name="rename" size={25} color="white" />
              </Pressable>

              <Pressable style={styles.midButton} 
                onPress={() => { 
                  // alert("show image info")
                  // showImageInfo(images[currentImageIndex])
                  setIsImageInfoVisible(true);
                }}
              >
                <Icons name="info" size={25} color="white" />
              </Pressable>

              <Pressable style={styles.deleteButton} 
                onPress={() => deleteImage(images[currentImageIndex]?.id)}
              >
                <Icons name="delete" size={25} color="white" />
              </Pressable>

              <Pressable 
                onPress={onNext} 
                disabled={nextDisabled} 
                style={({ pressed }) => [{ opacity: pressed || nextDisabled ? 0.5 : 1 }]}
              >
                <Icons name="right-arrow" size={30} color="white" />
              </Pressable>
            </View>
          </View>

          <ImageInfoModal 
            visible={isImageInfoVisible}
            onClose={() => setIsImageInfoVisible(false)}
            image={images[currentImageIndex]}
          />

        </GestureHandlerRootView>
      </Modal>

      {/* Gallery Grid */}
      {images.length === 0 ? (
        <Text style={styles.message}>No photos available.</Text>
      ) : (
        <FlatList
          data={images}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          numColumns={4}
          contentContainerStyle={styles.gridContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  topRightCornder: {
    width: "51%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  message: {
    textAlign: "center",
    fontSize: 16,
    color: "#aaa",
  },
  gridContainer: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  itemContainer: {
    width: "23%",
    marginBottom: 16,
    marginRight: 8,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
  },
  modalContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(20, 20, 20, 0.99)",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 8,
  },
  metadata: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginBottom: 16,
    gap: 4,
  },
  favButton: {
    width:64,
    padding: 12,
    marginHorizontal: 0,
    // backgroundColor: "#f44336",
    // borderColor: "grey",
    borderWidth:1,
    borderRadius: 8,
    marginLeft: 24,
    marginBottom: 20,
    flex: 1, 
    alignItems:"center"
  },
  midButton: {
    width:64,
    padding: 12,
    marginHorizontal: 0,
    // backgroundColor: "#f44336",
    // borderColor: "grey",
    borderWidth:1,
    borderRadius: 8,
    marginBottom: 20,
    flex: 1, 
    alignItems:"center"
  },
  deleteButton: {
    width:64,
    padding: 12,
    marginHorizontal: 0,
    // backgroundColor: "#f44336",
    // borderColor: "grey",
    borderWidth:1,
    borderRadius: 8,
    marginRight: 24,
    marginBottom: 20,
    flex: 1,
 
    alignItems:"center"
  },
  swipeControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems:"baseline",
    width: "100%",
    gap:8
  },
  closeButton: {
    position: "absolute",
    top: 20,
    left: 20,
    padding: 10,
    width:48,
    // backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 50,
  },
});

export default GalleryScreen;
