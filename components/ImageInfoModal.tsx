import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // You can use any icon library

// ImageInfoModal component that will display the image's details
const ImageInfoModal = ({ visible, onClose, image }) => {
  if (!image) return null;

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <FontAwesome name="close" size={24} color="white" />
          </TouchableOpacity>

          <Image source={{ uri: image.uri }} style={styles.image} />
          <Text style={styles.infoText}>URI: {image.uri}</Text>
          <Text style={styles.infoText}>Latitude: {image.latitude}</Text>
          <Text style={styles.infoText}>Longitude: {image.longitude}</Text>
          <Text style={styles.infoText}>Timestamp: {image.timestamp}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
    },
    thumbnail: {
      width: 150,
      height: 150,
      borderRadius: 10,
      marginBottom: 20,
    },
    infoButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      borderRadius: 50,
      padding: 10,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      width: 300,
      alignItems: 'center',
    },
    closeButton: {
      position: 'absolute',
      top: 10,
      right: 10,
    },
    image: {
      width: 250,
      height: 250,
      borderRadius: 10,
      marginBottom: 20,
    },
    infoText: {
      fontSize: 14,
      color: '#333',
      marginBottom: 10,
    },
  });

  export default ImageInfoModal;
  