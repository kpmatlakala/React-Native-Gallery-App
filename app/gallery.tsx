import { View, Text, StyleSheet } from "react-native";

export default function Gallery() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gallery Screen</Text>
      {/* Fetch and display images here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
