import { Colors } from "@/constants/Colors";
import { Movie } from "@/types/movie";
import { getPoster } from "@/util/image";
import Entypo from "@expo/vector-icons/Entypo";
import { Link } from "expo-router";
import React, { memo, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const POSTER_WIDTH = 100;
const POSTER_HEIGHT = 150;

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
  const [loading, setLoading] = useState(true);
  return (
    <Link href={`../movies/${id}`} asChild>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.container}>
          <View style={styles.posterWrapper}>
            {(loading || !poster_path) && (
              <Image
                source={require("../assets/images/placeholder-portrait.png")}
                style={styles.poster}
                resizeMode="cover"
              />
            )}
            {poster_path && (
              <Image
                source={{ uri: getPoster(poster_path) }}
                style={styles.poster}
                resizeMode="cover"
                onLoadEnd={() => setLoading(false)}
              />
            )}
          </View>

          <View style={styles.movieContentContainer}>
            <Text style={{ color: Colors.btnText }} numberOfLines={1}>
              {media_type ? (media_type === "movie" ? title : name) : title}
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

  posterWrapper: {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
  },

  poster: {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    position: "absolute",
    top: 0,
    left: 0,
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
