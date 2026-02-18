import Header from "@/components/Header";
import HorizontalList from "@/components/HorizontalList";
import SerieCard from "@/components/SerieCard";
import { Colors } from "@/constants/Colors";
import usePaginatedFetch from "@/hooks/usePaginatedFetch";
import {
   fetchLatestSeries,
   fetchPopularSeries,
   fetchTopRatedSeries,
} from "@/services/serieService";
import { Serie } from "@/types/serie";
import {
   ActivityIndicator,
   ScrollView,
   StyleSheet,
   Text,
   View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SeriesScreen() {
   const {
      data: latestSeries,
      loading: latestSeriesLoading,
      error: latestSeriesError,
      loadMore: loadMoreLatestSeries,
   } = usePaginatedFetch(fetchLatestSeries);

   const {
      data: topRatedSeries,
      loading: topRatedSeriesLoading,
      error: topRatedSeriesError,
      loadMore: loadMoreTopRatedSeries,
   } = usePaginatedFetch(fetchTopRatedSeries);

   const {
      data: popularSeries,
      loading: popularSeriesLoading,
      error: popularSeriesError,
      loadMore: loadMorePopularSeries,
   } = usePaginatedFetch(fetchPopularSeries);

   return (
      <SafeAreaView style={styles.container}>
         <Header />
         <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
         >
            {latestSeriesLoading &&
            topRatedSeriesLoading &&
            popularSeriesLoading ? (
               <ActivityIndicator size="large" color={Colors.card} />
            ) : latestSeriesError ||
              topRatedSeriesError ||
              popularSeriesError ? (
               <Text>Error: {popularSeriesError?.message}</Text>
            ) : (
               <View>
                  <HorizontalList<Serie>
                     title="Latest Series"
                     data={latestSeries}
                     loadMore={loadMoreLatestSeries}
                     loading={latestSeriesLoading}
                     keyExtractor={(item) => item.id.toString()}
                     renderItem={({ item }) => <SerieCard {...item} />}
                  />

                  <HorizontalList<Serie>
                     title="Top Rated Series"
                     data={topRatedSeries}
                     loadMore={loadMoreTopRatedSeries}
                     loading={topRatedSeriesLoading}
                     keyExtractor={(item) => item.id.toString()}
                     renderItem={({ item }) => <SerieCard {...item} />}
                  />

                  <HorizontalList<Serie>
                     title="Popular Series"
                     data={popularSeries}
                     loadMore={loadMorePopularSeries}
                     loading={popularSeriesLoading}
                     keyExtractor={(item) => item.id.toString()}
                     renderItem={({ item }) => <SerieCard {...item} />}
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
