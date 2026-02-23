import { Colors } from "@/constants/Colors";
import { Person } from "@/types/person";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import ActorProfile from "./ActorProfile";

export default function CastGrid({
  title,
  casts,
}: {
  title?: string;
  casts: Person[];
}) {
  return (
    <View>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        data={casts}
        renderItem={({ item }) => <ActorProfile {...item} />}
        numColumns={3}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        contentContainerStyle={{ padding: 5 }}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    marginVertical: 10,
    color: Colors.text,
    fontSize: 18,
    fontWeight: "bold",
  },
});
