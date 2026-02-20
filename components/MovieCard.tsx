import { Colors } from "@/constants/Colors";
import { Movie } from "@/types/movie";
import { getPoster } from "@/util/image";
import Entypo from "@expo/vector-icons/Entypo";
import { Link } from "expo-router";
import React, { memo } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const MovieCard = ({
   id,
   poster_path,
   title,
   name,
   media_type,
   vote_average,
   release_date,
   onPress,
}: Movie & { onPress?: () => void }) => {
   return (
      <Link href={`../movies/${id}`} asChild>
         <TouchableOpacity onPress={onPress}>
            <View style={styles.container}>
               {poster_path ? (
                  <Image
                     source={{ uri: getPoster(poster_path) }}
                     style={{ width: 100, height: 150 }}
                     resizeMode="cover"
                  />
               ) : (
                  <View style={{backgroundColor: Colors.background, width: 100, height: 150, justifyContent: "center", alignItems: "center"}}>
                     <Text style={{ color: Colors.btnText, textAlign: "center" }}>No Poster Available</Text>
                  </View>
               )}

               <View style={styles.movieContentContainer}>
                  <Text style={{ color: Colors.btnText }} numberOfLines={1}>
                     {media_type
                        ? media_type === "movie"
                           ? title
                           : name
                        : title}
                  </Text>
                  <View style={styles.ratingAndYearContainer}>
                     <Text style={{ color: Colors.btnText }}>
                        <Entypo name="star" size={14} color="yellow" />
                        {Math.round(vote_average * 10) / 10}
                     </Text>
                     <Text style={{ color: Colors.btnText }}>
                        {release_date?.split("-")[0]}
                     </Text>
                  </View>
               </View>
            </View>
         </TouchableOpacity>
      </Link>
   );
};

export default memo(MovieCard);

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
