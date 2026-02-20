// app/search.tsx

import ActorProfile from "@/components/ActorProfile";
import HorizontalList from "@/components/HorizontalList";
import MovieCard from "@/components/MovieCard";
import SerieCard from "@/components/SerieCard";
import { Colors } from "@/constants/Colors";
import useSearchFetch from "@/hooks/useSearchFetch";
import { Movie } from "@/types/movie";
import { Person } from "@/types/person";
import { Serie } from "@/types/serie";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HISTORY_KEY = "search_history";
const MAX_HISTORY = 10;

type HistoryItem = {
  query: string;
  timestamp: number;
};

const SearchScreen = () => {
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const { results, loading, loadMore } = useSearchFetch(query);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const raw = await AsyncStorage.getItem(HISTORY_KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch (e) {
      console.error("Failed to load search history:", e);
    }
  };

  const saveToHistory = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    try {
      const raw = await AsyncStorage.getItem(HISTORY_KEY);
      const existing: HistoryItem[] = raw ? JSON.parse(raw) : [];
      const filtered = existing.filter(
        (h) => h.query.toLowerCase() !== searchQuery.toLowerCase()
      );
      const updated: HistoryItem[] = [
        { query: searchQuery, timestamp: Date.now() },
        ...filtered,
      ].slice(0, MAX_HISTORY);
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      setHistory(updated);
    } catch (e) {
      console.error("Failed to save search history:", e);
    }
  }, []);

  const deleteHistoryItem = useCallback(async (queryToDelete: string) => {
    try {
      const raw = await AsyncStorage.getItem(HISTORY_KEY);
      const existing: HistoryItem[] = raw ? JSON.parse(raw) : [];
      const updated = existing.filter((h) => h.query !== queryToDelete);
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      setHistory(updated);
    } catch (e) {
      console.error("Failed to delete history item:", e);
    }
  }, []);

  const clearHistory = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(HISTORY_KEY);
      setHistory([]);
    } catch (e) {
      console.error("Failed to clear history:", e);
    }
  }, []);

  const handleHistoryPress = (historyQuery: string) => {
    setQuery(historyQuery);
  };

  const showHistory = !query.trim() && history.length > 0;
  const showResults = query.trim().length > 0;
  const noResults =
    showResults &&
    !loading &&
    results.movies.length === 0 &&
    results.series.length === 0 &&
    results.actors.length === 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#c9c9c9" />
        </Pressable>

        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Search movies, series, actors ..."
            placeholderTextColor="#888"
            autoFocus={true}
            selectionColor={"#008080"}
            value={query}
            onChangeText={setQuery}
          />
          {query.length > 0 ? (
            <Pressable onPress={() => setQuery("")}>
              <Ionicons name="close-circle" size={20} color="#888" style={styles.searchIcon} />
            </Pressable>
          ) : (
            <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          )}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {showHistory && (
          <View style={styles.historyContainer}>
            <View style={styles.historyHeader}>
              <Text style={styles.sectionTitle}>Recent Searches</Text>
              <TouchableOpacity onPress={clearHistory}>
                <Text style={styles.clearAll}>Clear all</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={history}
              keyExtractor={(item) => item.query}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View style={styles.historyItem}>
                  <TouchableOpacity
                    style={styles.historyTextRow}
                    onPress={() => handleHistoryPress(item.query)}
                  >
                    <Ionicons name="time-outline" size={16} color="#888" />
                    <Text style={styles.historyText}>{item.query}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteHistoryItem(item.query)}>
                    <Ionicons name="close" size={16} color="#888" />
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        )}

        {loading && results.movies.length === 0 && (
          <Text style={styles.statusText}>Searching...</Text>
        )}

        {noResults && (
          <Text style={styles.statusText}>No results for "{query}"</Text>
        )}

        {showResults && (
          <View>
            {results.movies.length > 0 && (
              <HorizontalList<Movie>
                title="Movies"
                data={results.movies}
                loadMore={loadMore}
                loading={loading}
                keyExtractor={(item) => `movie-${item.id}`}
                renderItem={({ item }) => (
                  <MovieCard {...item} onPress={() => saveToHistory(query)} />
                )}
              />
            )}
            {results.series.length > 0 && (
              <HorizontalList<Serie>
                title="Series"
                data={results.series}
                loadMore={loadMore}
                loading={loading}
                keyExtractor={(item) => `serie-${item.id}`}
                renderItem={({ item }) => (
                  <SerieCard {...item} onPress={() => saveToHistory(query)} />
                )}
              />
            )}
            {results.actors.length > 0 && (
              <HorizontalList<Person>
                title="Actors"
                data={results.actors}
                loadMore={loadMore}
                loading={loading}
                keyExtractor={(item) => `actor-${item.id}`}
                renderItem={({ item }) => (
                  <ActorProfile {...item} onPress={() => saveToHistory(query)} />
                )}
              />
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  backButton: {
    marginRight: 10,
  },
  searchWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 48,
    borderWidth: 1.5,
    borderColor: "#333",
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#FFFFFF",
  },
  searchIcon: {
    marginLeft: 10,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  historyContainer: {
    marginTop: 8,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#c9c9c9",
  },
  clearAll: {
    fontSize: 13,
    color: "#008080",
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#222",
  },
  historyTextRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  historyText: {
    color: "#c9c9c9",
    fontSize: 14,
  },
  statusText: {
    color: "#888",
    textAlign: "center",
    marginTop: 40,
    fontSize: 14,
  },
});