import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="search" />
        <Stack.Screen name="movies/[id]" />
        <Stack.Screen name="series/[id]" />
        <Stack.Screen name="actors/[id]" />
      </Stack>
    </View>
  );
}
