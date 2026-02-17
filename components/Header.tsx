import { Colors } from "@/constants/Colors";
import Feather from "@expo/vector-icons/Feather";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Header = () => {
   return (
      <View style={styles.container}>
         <Text
            style={{ fontWeight: "bold", fontSize: 24, color: Colors.title }}
         >
            Movie Hub
         </Text>
         <TouchableOpacity style={styles.searchBtn}>
            <Feather name="search" size={24} color={Colors.btnText} />
            <Text style={{ color: Colors.btnText }}>Search</Text>
         </TouchableOpacity>
      </View>
   );
};

export default Header;

const styles = StyleSheet.create({
   container: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 10,
   },

   searchBtn: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: Colors.btnColor,
      borderRadius: 5,
      paddingHorizontal: 10,
      paddingVertical: 5,
   },
});
