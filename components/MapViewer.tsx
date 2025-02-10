import React from "react";
import MapView, { Marker } from "react-native-maps";
import { View, StyleSheet, useWindowDimensions } from "react-native";

export default function MapViewer({title, latitude, longitude}) 
{
  const {width ,height} = useWindowDimensions();
  console.log("mapview: ", latitude, longitude, " | ", title);
  const marker = {
    coordinate: {
      latitude: latitude,
      longitude: longitude,
    },
    title: title, // Using the title prop here
  };

  return (
    // <View style={styles.container}>
      <MapView style={{ width, height:300, }} initialRegion={{
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}>
        <Marker coordinate={{ latitude, longitude }} title={marker.title} />        
      </MapView>
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"grey"
  },
  map: {
    // flex: 1,
    backgroundColor:"grey",
    width:300,
    height:400
  },
});
