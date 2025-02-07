import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // You can use any icon library
import Map from '@/app/map';

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
            <Text style={styles.infoText}>{image.album} / {image.name} </Text>
            <Text style={styles.infoText}>URI: {image.uri}</Text> 
            
            {/* <Text style={styles.infoText}>Latitude: {image.latitude}</Text>
            <Text style={styles.infoText}>Longitude: {image.longitude}</Text> */}
            <Text style={styles.infoText}>{image.timestamp}</Text>
            <Text style={styles.infoText}>{image.tag}</Text>
            <Map />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding:8
    },
    modalContent: {
        flex:1,
        width:"100%",
        backgroundColor: 'white',
        padding: 2,
        borderRadius: 10,    
        alignItems: 'center',
    },
    image: {
        width: "100%",
        height: 250,
        borderRadius: 10,
        marginBottom: 20,
      },
    infoText: {
      fontSize: 14,
      color: '#333',
      marginBottom: 10,
      textAlign:"left"
    },
    closeButton: 
    {
      position: 'absolute',
      top: 10,
      right: 10,
    },
    
    
  });

  export default ImageInfoModal;
  