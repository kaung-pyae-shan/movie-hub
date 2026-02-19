import MovieCard from "@/components/MovieCard";
import SerieCard from "@/components/SerieCard";
import { Colors } from "@/constants/Colors";
import useFetch from "@/hooks/useFetch";
import { fetchActorDetails } from "@/services/actorService";
import { fetchActorSpecificMovies } from "@/services/movieService";
import { fetchActorSpecificSeries } from "@/services/serieService";
import { getPoster } from "@/util/image";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ActorDetails = () => {
  const [expanded, setExpanded] = useState(false);
  const { id } = useLocalSearchParams();

  if (!id) return <Text>Invalid actor ID</Text>;

  const { data: actor, loading } = useFetch(() =>
    fetchActorDetails(id as string),
  );

  const { data: movies, loading: moviesLoading } = useFetch(() =>
    fetchActorSpecificMovies(id as string),
  );

  const { data: series, loading: seriesLoading } = useFetch(() =>
    fetchActorSpecificSeries(id as string),
  );

  if (loading || !actor)
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator />
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profile}>
          {actor.profile_path ? (
            <Image
              source={{ uri: getPoster(actor.profile_path) }}
              style={{ width: 100, height: 100, borderRadius: 50 }}
              resizeMode="cover"
            />
          ) : (
            <Image
              source={require("../../assets/images/profile.jpg")}
              style={{ width: 100, height: 100, borderRadius: 50 }}
              resizeMode="cover"
            />
          )}

          <Text style={styles.title}>{actor.name}</Text>
        </View>

        <View>
          <Text style={styles.title}>Biography</Text>
          {actor.biography ? (
            <>
              <Text
                style={styles.text}
                numberOfLines={expanded ? undefined : 6}
              >
                {actor.biography}
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

        <View style={styles.starredSection}>
          <Text style={styles.title}>Movies starred by {actor.name}</Text>
          {movies && movies.cast.length > 0 ? (
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={movies.cast}
              renderItem={({ item }) => <MovieCard {...item} />}
              keyExtractor={(item) =>
                item.credit_id ??
                `movie-${item.id}-${item.character ?? "unknown"}`
              }
              contentContainerStyle={{
                gap: 7,
                paddingHorizontal: 5,
                paddingTop: 8,
              }}
            />
          ) : (
            <Text style={styles.text}>No movies available.</Text>
          )}
        </View>

        <View style={styles.starredSection}>
          <Text style={styles.title}>Series starred by {actor.name}</Text>
          {series && series.cast.length > 0 ? (
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={series.cast}
              renderItem={({ item }) => <SerieCard {...item} />}
              keyExtractor={(item) =>
                item.credit_id ?? `tv-${item.id}-${item.character ?? "unknown"}`
              }
              contentContainerStyle={{
                gap: 7,
                paddingHorizontal: 5,
                paddingTop: 8,
              }}
            />
          ) : (
            <Text style={styles.text}>No movies available.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ActorDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
  },
  profile: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  text: {
    color: Colors.btnText,
  },
  title: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "bold",
  },
  starredSection: {
    marginTop: 20,
  },
});
