import EpisodeCard from "@/components/EpisodeCard";
import { FloatingBack } from "@/components/FloatingBack";
import { Colors } from "@/constants/Colors";
import useFetch from "@/hooks/useFetch";
import { fetchSeasonDetails } from "@/services/serieService";
import { getPoster } from "@/util/image";
import { useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SeasonDetails() {
  const { id, seasonNumber } = useLocalSearchParams<{
    id: string;
    seasonNumber: string;
  }>();

  const { data: season, loading } = useFetch(() =>
    fetchSeasonDetails(id, Number(seasonNumber)),
  );

  const episodes = season?.episodes ?? [];

  if (loading || !season) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FloatingBack />

      <FlatList
        ListHeaderComponent={
          <>
            {season.poster_path ? (
              <Image
                source={{ uri: getPoster(season.poster_path) }}
                defaultSource={require("../../../../assets/images/placeholder-portrait.png")}
                style={styles.poster}
                resizeMode="contain"
              />
            ) : (
              <Image
                source={require("../../../../assets/images/placeholder-portrait.png")}
                style={styles.poster}
              />
            )}

            <Text style={[styles.title, { alignSelf: "center" }]}>
              {season.name || `Season ${season.season_number}`}
            </Text>

            <Text style={[styles.overview, { alignSelf: "center" }]}>
              {season.air_date?.split("-")[0]} · {episodes.length} Episodes
            </Text>

            <Text style={styles.overview}>
              {season.overview || "No overview available."}
            </Text>

            <Text style={styles.sectionTitle}>Episodes</Text>
          </>
        }
        data={episodes}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={{ color: Colors.btnText }}>
            No episode information available.
          </Text>
        }
        renderItem={({ item }) => <EpisodeCard episode={item} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
  },

  poster: {
    width: "100%",
    height: 260,
    borderRadius: 10,
    marginTop: 40,
  },

  title: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 15,
  },

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

  overview: {
    color: Colors.btnText,
    marginTop: 10,
    lineHeight: 20,
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
});
