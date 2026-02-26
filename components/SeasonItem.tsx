import { Colors } from "@/constants/Colors";
import { getPoster } from "@/util/image";
import { Link, useLocalSearchParams } from "expo-router";
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

const MAX_LINES = 3;
const POSTER_WIDTH = 100;
const POSTER_HEIGHT = 150;

const SeasonItem = ({ season }: { season: Season }) => {
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [measured, setMeasured] = useState(false);
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <Link href={`../series/${id}/seasons/${season.season_number}`} asChild>
      <TouchableOpacity style={styles.card}>
        <View style={styles.posterWrapper}>
          {(loading || !season.poster_path) && (
            <Image
              source={require("../assets/images/placeholder-portrait.png")}
              style={styles.poster}
              resizeMode="cover"
            />
          )}
          {season.poster_path && (
            <Image
              source={{ uri: getPoster(season.poster_path) }}
              style={styles.poster}
              resizeMode="cover"
              onLoadEnd={() => setLoading(false)}
            />
          )}
        </View>
        {/* {season.poster_path ? (
          <Image
            source={{ uri: getPoster(season.poster_path) }}
            style={{ width: 100, height: 150 }}
            resizeMode="cover"
          />
        ) : (
          <Image
            source={require("../assets/images/placeholder-portrait.png")}
            style={{ width: 100, height: 150 }}
            resizeMode="cover"
          />
        )} */}

        <View style={styles.info}>
          {season.season_number === 0 ? (
            <Text style={styles.title}>Specials</Text>
          ) : (
            <Text style={styles.title}>Season {season.season_number}</Text>
          )}

          <Text style={styles.text}>
            {season.air_date?.split("-")[0]} - {season.episode_count} Episodes
          </Text>

          {/* {season.overview ? (
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
          )} */}

          {season.overview ? (
            <>
              {!measured && (
                <Text
                  style={[styles.text, styles.hiddenText]}
                  onTextLayout={(e) => {
                    setIsOverflowing(e.nativeEvent.lines.length > MAX_LINES);
                    setMeasured(true);
                  }}
                >
                  {season.overview}
                </Text>
              )}

              {/* 🔹 Visible text */}
              <Text
                style={styles.text}
                numberOfLines={expanded ? undefined : MAX_LINES}
              >
                {season.overview}
              </Text>

              {isOverflowing && (
                <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                  <Text style={{ color: "#3498db", marginTop: 4 }}>
                    {expanded ? "Show Less" : "Read More"}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <Text style={styles.text}>No overview available.</Text>
          )}
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default SeasonItem;

const styles = StyleSheet.create({
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

  hiddenText: {
    position: "absolute",
    opacity: 0,
    zIndex: -1,
  },
});
