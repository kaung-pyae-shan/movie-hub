import AsyncStorage from "@react-native-async-storage/async-storage";

// - query: what the user searched
// - timestamp: when the search happened (used for sorting or tracking)
export type HistoryItem = {
  query: string;
  timestamp: number;
};

const STORAGE_KEY = "search_history";
const MAX_HISTORY = 10;

// Get stored search history (or empty array if none)
export const getSearchHistory = async (): Promise<HistoryItem[]> => {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// Save entire history array
export const saveSearchHistory = async (items: HistoryItem[]) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

// Add new query (remove duplicates, keep max 10, newest first)
export const addToSearchHistory = async (
  query: string,
): Promise<HistoryItem[]> => {
  if (!query.trim()) return getSearchHistory();

  const history = await getSearchHistory();

  const filtered = history.filter(
    (item) => item.query.toLowerCase() !== query.toLowerCase(),
  );

  const updated: HistoryItem[] = [
    { query, timestamp: Date.now() },
    ...filtered,
  ].slice(0, MAX_HISTORY);

  await saveSearchHistory(updated);
  return updated;
};

// Remove one search item
export const deleteSearchHistoryItem = async (
  queryToDelete: string,
): Promise<HistoryItem[]> => {
  const history = await getSearchHistory();
  const updated = history.filter((h) => h.query !== queryToDelete);
  await saveSearchHistory(updated);
  return updated;
};

// Clear all search history
export const clearSearchHistory = async () => {
  await AsyncStorage.removeItem(STORAGE_KEY);
};
