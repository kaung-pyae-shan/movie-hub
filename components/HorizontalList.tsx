import { Colors } from "@/constants/Colors";
import { Movie } from "@/types/movie";
import { Serie } from "@/types/serie";
import React, { ReactElement, useCallback } from "react";
import {
   ActivityIndicator,
   FlatList,
   StyleSheet,
   Text,
   View,
} from "react-native";
import MovieCard from "./MovieCard";
import SerieCard from "./SerieCard";

type HorizontalListProps<T> = {
   title: string;
   data: T[];
   loadMore: () => void;
   loading: boolean;
   keyExtractor: (item: T) => string;
   renderItem: ({ item }: { item: T }) => ReactElement;
};

const renderMovieItem = useCallback(
   ({ item }: { item: Movie }) => <MovieCard {...item} />,
   [],
);

const renderSerieItem = useCallback(
   ({ item }: { item: Serie }) => <SerieCard {...item} />,
   [],
);

const HorizontalList = <T,>({
   title,
   data,
   loadMore,
   loading,
   keyExtractor,
   renderItem,
}: HorizontalListProps<T>) => {
   return (
      <View>
         <Text style={styles.title}>{title}</Text>
         <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={data}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={{ gap: 7 }}
            onEndReached={loadMore}
            onEndReachedThreshold={0.7}
            ListFooterComponent={
               loading ? <ActivityIndicator size="small" /> : null
            }
         />
      </View>
   );
};

export default HorizontalList;

const styles = StyleSheet.create({
   title: {
      fontSize: 18,
      fontWeight: "light",
      color: Colors.title,
      marginTop: 10,
   },
});
