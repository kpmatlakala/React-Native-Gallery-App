// CameraScreen.tsx
import Icons from "@/utils/Icons";

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { insertImage } from '@/database/database';

interface CameraScreenProps {
  onClose: () => void;
  onImageCaptured: () => void;  // Callback to refresh the images in GalleryScreen
}

const CameraScreen = ({ onClose, onImageCaptured }: CameraScreenProps) => {
  const [facing, setFacing] = useState<CameraType>('back');
  const [location, setLocation] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);

  useEffect(() => {
    const getLocationPermissions = async () => {
      const locationStatus = await Location.requestForegroundPermissionsAsync();
      if (locationStatus.status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
      }
    };

    getLocationPermissions();
  }, []);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Pressable onPress={requestPermission}>
          <Text>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const capturePhoto = async () => {
    if (cameraRef.current)
    {
      try 
      {
        const photo = await cameraRef.current.takePictureAsync();
        if (location) 
        {
          await insertImage(photo.uri, location.coords.latitude, location.coords.longitude);
        }
        onImageCaptured(); // Refresh images in GalleryScreen
        // onClose(); // Close the camera modal after taking the picture
      } 
      catch (error) { console.error('Error capturing photo:', error); }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} type={facing} ref={cameraRef}>
        <View style={styles.footerContainer}>
          <Pressable style={styles.button} onPress={onClose}>
            <Icons name="images" />
            {/* <Text style={styles.text}>Cancel</Text> */}
          </Pressable>

          <Pressable style={styles.cameraButton} onPress={capturePhoto}>
            {/* <Text style={styles.text}>Take Photo</Text> */}
            <Icons name="camera" />
          </Pressable>

          <Pressable style={styles.button} onPress={toggleCameraFacing}>
            <Icons name="camera-rotate" />
            {/* <Text style={styles.text}>Flip Camera camera-rotate</Text> */}
          </Pressable>
          
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  footerContainer: {
    position:"absolute",
    bottom:16,
    left:0,
    right:0,
    width:"99%",
    height: 86,
    flexDirection: 'row',
    justifyContent:"space-evenly",
    alignItems:"center",
    backgroundColor: 'transparent',
    padding: 16,
    
  },
  button: {
    // flex: 1,
  
    alignItems: 'center',
    justifyContent:"center",
    
    width: 64,
    height: 64,
    backgroundColor:"grey",

    borderRadius: 64,
  },
  cameraButton: {
    // flex: 1,
  
    alignItems: 'center',
    justifyContent:"center",
    
    width: 86,
    height: 86,
    backgroundColor:"grey",

    borderRadius: 64,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default CameraScreen;
