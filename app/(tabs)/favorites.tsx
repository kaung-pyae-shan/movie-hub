import Header from "@/components/Header";
import MovieCard from "@/components/MovieCard";
import SerieCard from "@/components/SerieCard";
import { Colors } from "@/constants/Colors";
import { fetchMovieDetails } from "@/services/movieService";
import { fetchSerieDetails } from "@/services/serieService";
import { getFavorites } from "@/storage/favoriteStorage";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const EmptyFavorites = () => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyText}>No favorites yet</Text>
  </View>
);

const FavoriteScreen = () => {
  const [selectedTab, setSelectedTab] = useState<"movie" | "tv">("movie");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const loadFavourites = async () => {
        setLoading(true);

        const saved = await getFavorites();

        const filtered = saved.filter((item) => item.mediaType === selectedTab);

        const detailedData = await Promise.all(
          filtered.map((item) =>
            item.mediaType === "movie"
              ? fetchMovieDetails(item.id.toString())
              : fetchSerieDetails(item.id.toString()),
          ),
        );

        setData(detailedData);
        setLoading(false);
      };

      loadFavourites();
    }, [selectedTab]),
  );
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "movie" && styles.activeTab]}
          onPress={() => setSelectedTab("movie")}
        >
          <Text
            style={[
              styles.toggleText,
              selectedTab === "movie" && styles.activeText,
            ]}
          >
            Movies
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === "tv" && styles.activeTab]}
          onPress={() => setSelectedTab("tv")}
        >
          <Text
            style={[
              styles.toggleText,
              selectedTab === "tv" && styles.activeText,
            ]}
          >
            Series
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={formatData(data, 3)}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 5,
            paddingTop: 8,
          }}
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginBottom: 12,
          }}
          numColumns={3}
          ListEmptyComponent={!loading ? <EmptyFavorites /> : null}
          renderItem={({ item }) => {
            if (item.empty) {
              return <View style={{ width: 100, marginBottom: 12 }} />;
            }

            return selectedTab === "movie" ? (
              <MovieCard {...item} />
            ) : (
              <SerieCard {...item} />
            );
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default FavoriteScreen;

const formatData = (data: any[], numColumns: number) => {
  const remainder = data.length % numColumns;

  if (remainder === 0) return data;

  const fillers = Array.from({ length: numColumns - remainder }).map(
    (_, index) => ({
      id: `empty-${index}`,
      empty: true,
    }),
  );

  return [...data, ...fillers];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
  },
  toggleContainer: {
    width: "90%",
    alignSelf: "center",
    flexDirection: "row",
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: "#008080",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#888888",
  },
  activeText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  gridItem: {
    marginRight: 12,
    marginBottom: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 70,
  },

  emptyText: {
    color: "#888",
    fontSize: 16,
    fontWeight: "500",
  },
});
