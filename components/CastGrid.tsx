import { Colors } from "@/constants/Colors";
import { Person } from "@/types/person";
import React from "react";
import { FlatList, Text, View } from "react-native";
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
         <Text
            style={{
               color: Colors.text,
               fontSize: 18,
               fontWeight: "bold",
            }}
         >
            {title}
         </Text>
         <FlatList
            data={casts}
            renderItem={({ item }) => (
               <View style={{ flex: 1, marginVertical: 6 }}>
                  <ActorProfile {...item} />
               </View>
            )}
            numColumns={3}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            contentContainerStyle={{ padding: 5, flexGrow: 1 }}
         />
      </View>
   );
}
