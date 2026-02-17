import ActorProfile from "@/components/ActorProfile";
import Header from "@/components/Header";
import HorizontalList from "@/components/HorizontalList";
import MovieCard from "@/components/MovieCard";
import SerieCard from "@/components/SerieCard";
import { Colors } from "@/constants/Colors";
import usePaginatedFetch from "@/hooks/usePaginatedFetch";
import { fetchPopularActors } from "@/services/actorService";
import { fetchLatestMovies, fetchPopularMovies, fetchTopRatedMovies, fetchTrendings } from "@/services/movieService";
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

export default function MoviesScreen() {
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
         <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
         >
            {latestMoviesLoading && topRatedMoviesLoading && popularMoviesLoading ? (
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
