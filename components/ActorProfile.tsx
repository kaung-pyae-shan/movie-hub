import { Colors } from "@/constants/Colors";
import { Person } from "@/types/person";
import { getPoster } from "@/util/image";
import { Link } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ActorProfile = ({ id, name, profile_path }: Person) => {
   return (
      <Link href={`../movies/${id}`} asChild>
         <TouchableOpacity>
            <View style={styles.container}>
               {profile_path ? (
                  <Image
                     source={{ uri: getPoster(profile_path) }}
                     style={{ width: 100, height: 100, borderRadius: 50 }}
                     resizeMode="cover"
                  />
               ) : (
                  <Image
                     source={require("../assets/images/profile.jpg")}
                     style={{ width: 100, height: 100, borderRadius: 50 }}
                     resizeMode="cover"
                  />
               )}

               <Text style={{ color: Colors.btnText, textAlign: "center" }}>
                  {name}
               </Text>
            </View>
         </TouchableOpacity>
      </Link>
   );
};

export default ActorProfile;

const styles = StyleSheet.create({
   container: {
      width: 100,
      justifyContent: "center",
      overflow: "hidden",
   },
});
