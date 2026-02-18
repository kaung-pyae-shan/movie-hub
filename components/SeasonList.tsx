import { Colors } from "@/constants/Colors";
import { SerieDetail } from "@/types/serieDetail";
import { getPoster } from "@/util/image";
import React from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";

type Props = {
  seasons: SerieDetail["seasons"];
};

const SeasonList = ({ seasons }: Props) => {
  return (
    <FlatList
      data={seasons}
      keyExtractor={(item) => item.season_number.toString()}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <View style={styles.card}>
          {item.poster_path ? (
            <Image
              source={{ uri: getPoster(item.poster_path) }}
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
            <Text style={styles.title}>Season {item.season_number}</Text>

            <Text style={styles.text}>
              {item.air_date?.split("-")[0]} - {item.episode_count} Episodes
            </Text>

            {item.overview ? (
              <Text style={styles.text}>{item.overview}</Text>
            ) : (
              <Text style={styles.text}>No overview available.</Text>
            )}
          </View>
        </View>
      )}
      scrollEnabled={false}
    />
  );
};

export default SeasonList;

const styles = StyleSheet.create({
  text: {
    color: Colors.btnText,
  },

  title: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "bold",
  },
  list: {},
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 15,
    marginVertical: 10,
  },
  poster: {},
  placeholder: {},
  info: {
    flex: 1,
  },
});
