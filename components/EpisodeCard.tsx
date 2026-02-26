import { Colors } from "@/constants/Colors";
import { Episode } from "@/types/season";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const MAX_LINES = 3;

const EpisodeCard = ({ episode }: { episode: Episode }) => {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [measured, setMeasured] = useState(false);
  return (
    <View style={styles.episodeCard}>
      <Text style={styles.episodeTitle}>
        {episode.episode_number}. {episode.name}
      </Text>

      <Text style={styles.text}>
        {episode.runtime ? `${episode.runtime} min` : "Runtime N/A"}
      </Text>

      {episode.overview ? (
        <>
          {!measured && (
            <Text
              style={[styles.text, styles.hiddenText]}
              onTextLayout={(e) => {
                setIsOverflowing(e.nativeEvent.lines.length > MAX_LINES);
                setMeasured(true);
              }}
            >
              {episode.overview}
            </Text>
          )}

          {/* 🔹 Visible text */}
          <Text
            style={styles.text}
            numberOfLines={expanded ? undefined : MAX_LINES}
          >
            {episode.overview}
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
  );
};

export default EpisodeCard;

const styles = StyleSheet.create({
  sectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 15,
  },

  text: {
    color: Colors.btnText,
    marginTop: 4,
  },

  episodeCard: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#333",
  },

  episodeTitle: {
    color: Colors.text,
    fontWeight: "bold",
    fontSize: 16,
  },

  hiddenText: {
    position: "absolute",
    opacity: 0,
    zIndex: -1,
  },
});
