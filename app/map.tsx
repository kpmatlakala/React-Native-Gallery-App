import React from "react";
import MapView, { Marker } from "react-native-maps";
import { View, StyleSheet } from "react-native";

export default function Map() {
  const markers = [
    // Replace with actual data from SQLite
    { latitude: -31.78825, longitude: 18.3570000, title: "Photo 1" },
  ];

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={{
        latitude: -31.78825,
        longitude: 18.3570000,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}>
        {markers.map((marker, index) => (
          <Marker key={index} coordinate={marker} title={marker.title} />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
