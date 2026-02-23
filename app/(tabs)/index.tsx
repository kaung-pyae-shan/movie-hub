import ActorProfile from "@/components/ActorProfile";
import Header from "@/components/Header";
import HorizontalList from "@/components/HorizontalList";
import MovieCard from "@/components/MovieCard";
import SerieCard from "@/components/SerieCard";
import { Colors } from "@/constants/Colors";
import usePaginatedFetch from "@/hooks/usePaginatedFetch";
import { fetchPopularActors } from "@/services/actorService";
import { fetchLatestMovies, fetchTrendings } from "@/services/movieService";
import { fetchLatestSeries } from "@/services/serieService";
import { Movie } from "@/types/movie";
import { Person } from "@/types/person";
import { Serie } from "@/types/serie";
import {
   ActivityIndicator,
   ScrollView,
   StyleSheet,
   Text,
   View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const {
    data: trendings,
    loading: trendingsLoading,
    error: trendingsError,
    loadMore: loadMoreTrendings,
  } = usePaginatedFetch(fetchTrendings);

  const {
    data: latestMovies,
    loading: latestMoviesLoading,
    error: latestMoviesError,
    loadMore: loadMoreLatestMovies,
  } = usePaginatedFetch(fetchLatestMovies);

  const {
    data: latestSeries,
    loading: latestSeriesLoading,
    error: latestSeriesError,
    loadMore: loadMoreLatestSeries,
  } = usePaginatedFetch(fetchLatestSeries);

  const {
    data: popularActors,
    loading: popularActorsLoading,
    loadMore: loadMorePopularActors,
  } = usePaginatedFetch(fetchPopularActors);

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        {latestMoviesLoading && trendingsLoading && latestSeriesLoading ? (
          <ActivityIndicator size="large" color={Colors.card} />
        ) : trendingsError || latestMoviesError || latestSeriesError ? (
          <Text>Error: {trendingsError?.message}</Text>
        ) : (
          <View>
            <HorizontalList<Movie>
              title="Trendings"
              data={trendings}
              loadMore={loadMoreTrendings}
              loading={trendingsLoading}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) =>
                item.media_type === "movie" ? (
                  <MovieCard {...item} />
                ) : (
                  <SerieCard {...item} />
                )
              }
            />

            <HorizontalList<Movie>
              title="Latest Movies"
              data={latestMovies}
              loadMore={loadMoreLatestMovies}
              loading={latestMoviesLoading}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <MovieCard {...item} />}
            />

            <HorizontalList<Serie>
              title="Latest Series"
              data={latestSeries}
              loadMore={loadMoreLatestSeries}
              loading={latestSeriesLoading}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <SerieCard {...item} />}
            />

            <HorizontalList<Person>
              title="Popular Actors"
              data={popularActors}
              loadMore={loadMorePopularActors}
              loading={popularActorsLoading}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <ActorProfile {...item} />}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
  },
});
