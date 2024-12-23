import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { insertImage } from '@/database/database'; // Assuming your database functions are exported

const CameraScreen = () => {
  const [facing, setFacing] = useState<CameraType>('back');
  const [location, setLocation] = useState(null); // Geolocation data
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
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const capturePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        console.log('Photo taken:', photo);
        if (location) {
          // Save photo to database
          await insertImage(photo.uri, location.coords.latitude, location.coords.longitude);
        }
      } catch (error) {
        console.error('Error capturing photo:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} type={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={capturePhoto}>
            <Text style={styles.text}>Take Photo</Text>
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
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default CameraScreen;
