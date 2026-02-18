import { Colors } from "@/constants/Colors";
import { getPoster } from "@/util/image";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Season = {
   air_date: string;
   episode_count: number;
   overview: string | null;
   poster_path: string | null;
   season_number: number;
   vote_average: number;
};

const SeasonItem = ({ season }: { season: Season }) => {
   const [expanded, setExpanded] = useState(false);

   return (
      <View style={styles.card}>
         {season.poster_path ? (
            <Image
               source={{ uri: getPoster(season.poster_path) }}
               style={{ width: 100, height: 150 }}
               resizeMode="cover"
            />
         ) : (
            <View
               style={{
                  backgroundColor: Colors.background,
                  width: 100,
                  height: 150,
                  justifyContent: "center",
                  alignItems: "center",
               }}
            >
               <Text style={{ color: Colors.btnText, textAlign: "center" }}>
                  No Poster Available
               </Text>
            </View>
         )}

         <View style={styles.info}>
            {season.season_number === 0 ? (
               <Text style={styles.title}>Specials</Text>
            ) : (
               <Text style={styles.title}>Season {season.season_number}</Text>
            )}

            <Text style={styles.text}>
               {season.air_date?.split("-")[0]} - {season.episode_count}{" "}
               Episodes
            </Text>

            {season.overview ? (
               <>
                  <Text
                     style={styles.text}
                     numberOfLines={expanded ? undefined : 4}
                  >
                     {season.overview}
                  </Text>

                  <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                     <Text style={{ color: "#3498db", marginTop: 4 }}>
                        {expanded ? "Show Less" : "Read More"}
                     </Text>
                  </TouchableOpacity>
               </>
            ) : (
               <Text style={styles.text}>No overview available.</Text>
            )}
         </View>
      </View>
   );
};

export default SeasonItem;

const styles = StyleSheet.create({
   text: {
      color: Colors.btnText,
   },

   title: {
      color: Colors.text,
      fontSize: 18,
      fontWeight: "bold",
   },

   card: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 15,
      marginVertical: 10,
   },

   info: {
      flex: 1,
   },
});
