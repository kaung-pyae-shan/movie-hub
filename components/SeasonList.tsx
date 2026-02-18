import { SerieDetail } from "@/types/serieDetail";
import React from "react";
import { FlatList, StyleSheet, Text } from "react-native";
import SeasonItem from "./SeasonItem";
import { Colors } from "@/constants/Colors";

type Props = {
   seasons: SerieDetail["seasons"];
};

const SeasonList = ({ seasons }: Props) => {
   return (
      <>
         <Text style={styles.title}>Seasons</Text>
         <FlatList
            data={seasons}
            keyExtractor={(item) => item.season_number.toString()}
            renderItem={({ item }) => <SeasonItem season={item} />}
            scrollEnabled={false}
         />
      </>
   );
};

export default SeasonList;

const styles = StyleSheet.create({
   title: {
      color: Colors.text,
      fontSize: 18,
      fontWeight: "bold",
      marginTop: 20,
   },
});
