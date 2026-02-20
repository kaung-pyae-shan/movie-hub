import Entypo from "@expo/vector-icons/Entypo";
import { router } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

export function FloatingBack() {
  return (
    <Pressable onPress={() => router.back()} style={styles.backButton}>
      <Entypo name="cross" size={24} color="white" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: 60,
    right: 22,
    zIndex: 100,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
});
