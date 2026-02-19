import GenreDropdown from "@/components/GenreDropdown";
import Header from "@/components/Header";
import HorizontalList from "@/components/HorizontalList";
import MovieCard from "@/components/MovieCard";
import { Colors } from "@/constants/Colors";
import usePaginatedFetch from "@/hooks/usePaginatedFetch";
import {
   fetchLatestMovies,
   fetchMovieGenres,
   fetchMoviesByGenre,
   fetchPopularMovies,
   fetchTopRatedMovies,
} from "@/services/movieService";
import { Genre } from "@/types/genre";
import { Movie } from "@/types/movie";
import { useEffect, useState } from "react";
import {
   ActivityIndicator,
   FlatList,
   ScrollView,
   StyleSheet,
   Text,
   View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MoviesScreen() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(0);

  useEffect(() => {
    fetchMovieGenres().then((data) => {
      setGenres([{ id: 0, name: "All" }, ...data]);
    });
  }, []);

  const {
    data: filteredMovies,
    loading: filteredLoading,
    loadMore: loadMoreFiltered,
  } = usePaginatedFetch(
    selectedGenre !== null && selectedGenre !== 0
      ? (page) => fetchMoviesByGenre(selectedGenre, page)
      : null,
  );

  const {
    data: latestMovies,
    loading: latestMoviesLoading,
    error: latestMoviesError,
    loadMore: loadMoreLatestMovies,
  } = usePaginatedFetch(fetchLatestMovies);

  const {
    data: topRatedMovies,
    loading: topRatedMoviesLoading,
    error: topRatedMoviesError,
    loadMore: loadMoreTopRatedMovies,
  } = usePaginatedFetch(fetchTopRatedMovies);

  const {
    data: popularMovies,
    loading: popularMoviesLoading,
    error: popularMoviesError,
    loadMore: loadMorePopularMovies,
  } = usePaginatedFetch(fetchPopularMovies);

  const isInitialLoading =
    latestMoviesLoading &&
    topRatedMoviesLoading &&
    popularMoviesLoading &&
    latestMovies.length === 0 &&
    topRatedMovies.length === 0 &&
    popularMovies.length === 0;

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <GenreDropdown
        title={"Movies Genres"}
        genres={genres}
        selectedGenre={selectedGenre}
        onSelect={setSelectedGenre}
      />
      {selectedGenre !== null && selectedGenre !== 0 ? (
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={filteredMovies}
          renderItem={({ item }) => <MovieCard {...item} />}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 5,
            paddingTop: 8,
          }}
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginBottom: 8,
          }}
          onEndReached={loadMoreFiltered}
          onEndReachedThreshold={0.7}
          numColumns={3}
          ListFooterComponent={
            filteredLoading ? <ActivityIndicator size="small" /> : null
          }
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
        >
          {isInitialLoading ? (
            <ActivityIndicator size="large" color={Colors.card} />
          ) : latestMoviesError || topRatedMoviesError || popularMoviesError ? (
            <Text>Error: {popularMoviesError?.message}</Text>
          ) : (
            <View>
              <HorizontalList<Movie>
                title="Latest Movies"
                data={latestMovies}
                loadMore={loadMoreLatestMovies}
                loading={latestMoviesLoading}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <MovieCard {...item} />}
              />

              <HorizontalList<Movie>
                title="Top Rated Movies"
                data={topRatedMovies}
                loadMore={loadMoreTopRatedMovies}
                loading={topRatedMoviesLoading}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <MovieCard {...item} />}
              />

              <HorizontalList<Movie>
                title="Popular Movies"
                data={popularMovies}
                loadMore={loadMorePopularMovies}
                loading={popularMoviesLoading}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <MovieCard {...item} />}
              />
            </View>
          )}
        </ScrollView>
      )}
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
