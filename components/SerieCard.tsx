import { Colors } from "@/constants/Colors";
import { Movie } from "@/types/movie";
import { Serie } from "@/types/serie";
import { getPoster } from "@/util/image";
import Entypo from "@expo/vector-icons/Entypo";
import { Link } from "expo-router";
import React, { memo } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const SerieCard = ({
   id,
   poster_path,
   name,
   vote_average,
   first_air_date,
}: Serie) => {
   return (
      <Link href={`../series/${id}`} asChild>
         <TouchableOpacity>
            <View style={styles.container}>
               <Image
                  source={{ uri: getPoster(poster_path) }}
                  style={{ width: 100, height: 150 }}
                  resizeMode="cover"
               />

               <View style={styles.movieContentContainer}>
                  <Text style={{ color: Colors.btnText }} numberOfLines={1}>
                     {name}
                  </Text>
                  <View style={styles.ratingAndYearContainer}>
                     <Text style={{ color: Colors.btnText }}>
                        <Entypo name="star" size={14} color="yellow" />
                        {Math.round(vote_average * 10) / 10}
                     </Text>
                     <Text style={{ color: Colors.btnText }}>
                        {first_air_date?.split("-")[0]}
                     </Text>
                  </View>
               </View>
            </View>
         </TouchableOpacity>
      </Link>
   );
};

export default memo(SerieCard);

const styles = StyleSheet.create({
   container: {
      width: 100,
      backgroundColor: Colors.card,
      borderRadius: 10,
      overflow: "hidden",
   },

   movieContentContainer: {
      padding: 5,
   },

   ratingAndYearContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 5,
   },
});
