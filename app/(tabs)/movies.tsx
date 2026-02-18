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
      error: filteredError,
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

   return (
      <SafeAreaView style={styles.container}>
         <Header />
         <GenreDropdown
            genres={genres}
            selectedGenre={selectedGenre}
            onSelect={setSelectedGenre}
         />
         <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
         >
            {selectedGenre !== null && selectedGenre !== 0 ? (
               // Show only filtered results when a specific genre is selected
               filteredLoading ? (
                  <ActivityIndicator size="large" color={Colors.card} />
               ) : filteredError ? (
                  <Text>Error: {filteredError.message}</Text>
               ) : (
                  <HorizontalList<Movie>
                     title={
                        genres.find((g) => g.id === selectedGenre)?.name ||
                        "Filtered"
                     }
                     data={filteredMovies}
                     loadMore={loadMoreFiltered}
                     loading={filteredLoading}
                     keyExtractor={(item) => item.id.toString()}
                     renderItem={({ item }) => <MovieCard {...item} />}
                  />
               )
            ) : // Show default lists when "All" is selected
            latestMoviesLoading &&
              topRatedMoviesLoading &&
              popularMoviesLoading ? (
               <ActivityIndicator size="large" color={Colors.card} />
            ) : latestMoviesError ||
              topRatedMoviesError ||
              popularMoviesError ? (
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
