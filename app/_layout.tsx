import { Slot, Stack } from "expo-router";
import CameraScreen from "./camera";
import Home from "./index";
import Gallery from "./gallery";
import Map from "./map";
import React from "react";

const Layout = () => {
  return (
    // <Stack/>
    // <Slot />
    <Stack
      screenOptions={{
        headerShown: true, // Customize headers as needed
      }}
    >
      <Stack.Screen
        name="index" 
        options={{title: "Gallery App", headerShown:false }}       
      />
      <Stack.Screen
        name="camera"       
        options={{ title: "Camera", headerBackVisible: true }}  
      />
      <Stack.Screen
        name="gallery"        
        options={{ title: "Gallery" }}
      />
      <Stack.Screen
        name="map"        
        options={{ title: "Map View" }}        
      />
    </Stack>
  );
}

export default Layout;
