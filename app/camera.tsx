import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system'; // For handling file system
import { insertImage } from '@/database/database';
import Icons from "@/utils/Icons";

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
      <View style={styles.permission_container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        
        <Pressable style={{ padding: 32, backgroundColor: "lightgrey" }} onPress={requestPermission}>
          <Text>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  // Move the captured image to permanent storage
  const moveImageToPermanentLocation = async (uri: string) => {
    const fileName = uri.split('/').pop();  // Get the image file name from URI
    const permanentUri = `${FileSystem.documentDirectory}${fileName}`;  // New path in document directory

    try {
      await FileSystem.moveAsync({ from: uri, to: permanentUri });
      return permanentUri;  // Return the new URI after moving
    } catch (error) {
      console.error('Error moving file:', error);
      return uri;  // If something goes wrong, return original URI
    }
  };

  const capturePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        
        if (location) {
          // Move image to a permanent location
          const permanentUri = await moveImageToPermanentLocation(photo.uri);

          // Insert the image into the database with permanent URI
          await insertImage(permanentUri, location.coords.latitude, location.coords.longitude);

          // Notify the gallery to refresh
          onImageCaptured();
        }
      } catch (error) {
        console.error('Error capturing photo:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} type={facing} ref={cameraRef}>
        <View style={styles.footerContainer}>
          <Pressable style={styles.button} onPress={onClose}>
            <Icons name="images" />
          </Pressable>

          <Pressable style={styles.cameraButton} onPress={capturePhoto}>
            <Icons name="camera" />
          </Pressable>

          <Pressable style={styles.button} onPress={toggleCameraFacing}>
            <Icons name="camera-rotate" />
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
  permission_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16
  },
  camera: {
    flex: 1,
  },
  footerContainer: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    width: "99%",
    height: 86,
    flexDirection: 'row',
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: 'transparent',
    padding: 16,
  },
  button: {
    alignItems: 'center',
    justifyContent: "center",
    width: 64,
    height: 64,
    backgroundColor: "grey",
    borderRadius: 64,
  },
  cameraButton: {
    alignItems: 'center',
    justifyContent: "center",
    width: 86,
    height: 86,
    backgroundColor: "grey",
    borderRadius: 64,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default CameraScreen;
