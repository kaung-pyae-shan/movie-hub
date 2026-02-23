import AsyncStorage from "@react-native-async-storage/async-storage";

export type HistoryItem = {
  query: string;
  timestamp: number;
};

const STORAGE_KEY = "search_history";
const MAX_HISTORY = 10;

export const getSearchHistory = async (): Promise<HistoryItem[]> => {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveSearchHistory = async (items: HistoryItem[]) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export const addToSearchHistory = async (
  query: string
): Promise<HistoryItem[]> => {
  if (!query.trim()) return getSearchHistory();

  const history = await getSearchHistory();

  const filtered = history.filter(
    (item) => item.query.toLowerCase() !== query.toLowerCase()
  );

  const updated: HistoryItem[] = [
    { query, timestamp: Date.now() },
    ...filtered,
  ].slice(0, MAX_HISTORY);

  await saveSearchHistory(updated);
  return updated;
};

export const deleteSearchHistoryItem = async (
  queryToDelete: string
): Promise<HistoryItem[]> => {
  const history = await getSearchHistory();
  const updated = history.filter((h) => h.query !== queryToDelete);
  await saveSearchHistory(updated);
  return updated;
};

export const clearSearchHistory = async () => {
  await AsyncStorage.removeItem(STORAGE_KEY);
};