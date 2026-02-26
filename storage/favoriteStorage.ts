import { FavoriteItem } from "@/types/favoriteItem";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "favorites";

// Get favorites from local storage
export const getFavorites = async (): Promise<FavoriteItem[]> => {
   const data = await AsyncStorage.getItem(STORAGE_KEY);
   return data ? JSON.parse(data) : [];
};

// Save favorites to local storage
export const saveFavorites = async (items: FavoriteItem[]) => {
   await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

// favorites toggler
export const toggleFavorite = async (item: FavoriteItem) => {
   const favorites = await getFavorites();

   const exists = favorites.find(
      (fav) => fav.id === item.id && fav.mediaType === item.mediaType,
   );

   let updated;

   if (exists) {
      updated = favorites.filter(
         (fav) => !(fav.id === item.id && fav.mediaType === item.mediaType),
      );
   } else {
      updated = [...favorites, item];
   }

   await saveFavorites(updated);
   return updated;
};
