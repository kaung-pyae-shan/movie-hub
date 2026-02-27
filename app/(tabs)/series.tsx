import GenreDropdown from "@/components/GenreDropdown";
import Header from "@/components/Header";
import HorizontalList from "@/components/HorizontalList";
import SerieCard from "@/components/SerieCard";
import { Colors } from "@/constants/Colors";
import usePaginatedFetch from "@/hooks/usePaginatedFetch";
import {
  fetchOngoingSeries,
  fetchPopularSeries,
  fetchSerieGenres,
  fetchSeriesByGenre,
  fetchTopRatedSeries,
} from "@/services/serieService";
import { Genre } from "@/types/genre";
import { Serie } from "@/types/serie";
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

export default function SeriesScreen() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(0);

  useEffect(() => {
    fetchSerieGenres().then((data) => {
      setGenres([{ id: 0, name: "All" }, ...data]);
    });
  }, []);

  const {
    data: filteredSeries,
    loading: filteredLoading,
    loadMore: loadMoreFiltered,
  } = usePaginatedFetch(
    selectedGenre !== null && selectedGenre !== 0
      ? (page) => fetchSeriesByGenre(selectedGenre, page)
      : null,
  );

  const {
    data: ongoingSeries,
    loading: ongoingSeriesLoading,
    error: ongoingSeriesError,
    loadMore: loadMoreOngoingSeries,
  } = usePaginatedFetch(fetchOngoingSeries);

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

  const isInitialLoading =
    ongoingSeriesLoading &&
    topRatedSeriesLoading &&
    popularSeriesLoading &&
    ongoingSeries.length === 0 &&
    topRatedSeries.length === 0 &&
    popularSeries.length === 0;

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <Header />
      <GenreDropdown
        title={"Series Genres"}
        genres={genres}
        selectedGenre={selectedGenre}
        onSelect={setSelectedGenre}
      />
      {selectedGenre !== null && selectedGenre !== 0 ? (
        <FlatList
          data={filteredSeries}
          renderItem={({ item }) => <SerieCard {...item} />}
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
          ) : ongoingSeriesError ||
            topRatedSeriesError ||
            popularSeriesError ? (
            <Text>Error: {popularSeriesError?.message}</Text>
          ) : (
            <View style={styles.listContainer}>
              <HorizontalList<Serie>
                title="Ongoing Series"
                data={ongoingSeries}
                loadMore={loadMoreOngoingSeries}
                loading={ongoingSeriesLoading}
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
  listContainer: {
    flex: 1,
  },
});
