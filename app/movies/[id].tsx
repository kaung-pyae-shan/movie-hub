import CastGrid from "@/components/CastGrid";
import { Colors } from "@/constants/Colors";
import useFetch from "@/hooks/useFetch";
import {
   fetchMovieDetails,
   fetchMoviesCasts,
   fetchMovieVideos,
} from "@/services/movieService";
import { getFavorites, toggleFavorite } from "@/storage/favoriteStorage";
import { getPoster } from "@/util/image";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
   ActivityIndicator,
   Image,
   Modal,
   Pressable,
   ScrollView,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import YoutubePlayer from "react-native-youtube-iframe";

export default function MovieDetails() {
   const router = useRouter();
   const { id } = useLocalSearchParams();

   const [showTrailer, setShowTrailer] = useState(false);
   const [playing, setPlaying] = useState(false);

   const { data: videos } = useFetch(() => fetchMovieVideos(id as string));

   const { data: movie, loading } = useFetch(() =>
      fetchMovieDetails(id as string),
   );

   const [isFavourite, setIsFavourite] = useState(false);

   useEffect(() => {
      if (!movie) return;
      const checkFavourite = async () => {
         const favourites = await getFavorites();
         const exists = favourites.find(
            (fav) => fav.id === movie.id && fav.mediaType === "movie",
         );
         setIsFavourite(!!exists);
      };

      if (movie.id) checkFavourite();
   }, [movie]);

   const handleToggleFavorite = async () => {
      if (!movie) return;
      const updated = await toggleFavorite({
         id: movie.id,
         title: movie.title,
         poster_path: movie.poster_path,
         mediaType: "movie",
      });

      const exists = updated.find(
         (fav) => fav.id === movie.id && fav.mediaType === "movie",
      );

      setIsFavourite(!!exists);
   };

   const { data: castsAndCrews } = useFetch(() =>
      fetchMoviesCasts(id as string),
   );

   // Get YouTube trailer only
   const trailerKey = useMemo(() => {
      if (!videos?.results) return null;

      const trailer = videos.results.find(
         (v) => v.site === "YouTube" && v.type === "Trailer",
      );

      return trailer?.key ?? null;
   }, [videos]);

   if (loading || !movie)
      return (
         <SafeAreaView style={styles.container}>
            <ActivityIndicator />
         </SafeAreaView>
      );

   return (
      <SafeAreaView style={styles.container}>
         <ScrollView>
            <View style={styles.movieHeader}>
               <Image
                  source={{
                     uri: getPoster(movie.poster_path ?? null),
                  }}
                  style={{ width: 150, height: 225, borderRadius: 10 }}
                  resizeMode="cover"
               />
               <View style={{ flex: 1, paddingTop: 20 }}>
                  <Text style={styles.title}>
                     {movie.title} ({movie.release_date?.split("-")[0]})
                  </Text>
                  <Text style={styles.text}>Duration: {movie.runtime} min</Text>
                  <Text style={styles.text}>
                     {movie.genres.map((g) => g.name).join(", ")}
                  </Text>
                  <View style={styles.ratingRow}>
                     <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                           <Entypo name="star" size={14} color="yellow" />{" "}
                           {Math.round(movie.vote_average * 10) / 10}/10
                        </Text>
                     </View>

                     <TouchableOpacity
                        style={styles.badge}
                        onPress={handleToggleFavorite}
                     >
                        <Ionicons
                           name={isFavourite ? "bookmark" : "bookmark-outline"}
                           size={18}
                           color={isFavourite ? "#FFD700" : "#fff"}
                        />
                     </TouchableOpacity>
                  </View>
                  {trailerKey && (
                     <TouchableOpacity
                        style={styles.trailerBtn}
                        onPress={() => {
                           if (!trailerKey) return;
                           setShowTrailer(true);
                           setPlaying(true);
                        }}
                     >
                        <Text style={{ color: Colors.btnText }}>
                           Watch Trailer
                        </Text>
                     </TouchableOpacity>
                  )}
               </View>
            </View>

            <View>
               <Text style={styles.title}>Overview</Text>
               <Text style={styles.text}>{movie.overview}</Text>
            </View>

            {castsAndCrews?.cast?.length ? (
               <CastGrid title="Casts" casts={castsAndCrews.cast} />
            ) : (
               <Text style={{ color: Colors.text }}>
                  No casts information available.
               </Text>
            )}

            {castsAndCrews?.crew?.length ? (
               <CastGrid title="Crews" casts={castsAndCrews.crew} />
            ) : (
               <Text style={{ color: Colors.text }}>
                  No crews information available.
               </Text>
            )}
         </ScrollView>

         <Modal
            visible={showTrailer}
            animationType="fade"
            transparent
            onRequestClose={() => {
               setShowTrailer(false);
               setPlaying(false);
            }}
         >
            <View style={styles.modalOverlay}>
               <View style={styles.modalContainer}>
                  {/* Close Button */}
                  <Pressable
                     style={styles.closeBtn}
                     onPress={() => {
                        setShowTrailer(false);
                        setPlaying(false);
                     }}
                  >
                     <Entypo name="cross" size={28} color="#fff" />
                  </Pressable>

                  {/* YouTube Player */}
                  {trailerKey ? (
                     <YoutubePlayer
                        height={230}
                        play={playing}
                        videoId={trailerKey}
                     />
                  ) : (
                     <Text style={{ color: "#fff", textAlign: "center" }}>
                        No trailer available
                     </Text>
                  )}
               </View>
            </View>
         </Modal>
      </SafeAreaView>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: Colors.background,
      paddingHorizontal: 20,
   },

   movieHeader: {
      flexDirection: "row",
      gap: 20,
      marginBottom: 20,
   },

   text: {
      color: Colors.btnText,
   },

   title: {
      color: Colors.text,
      fontSize: 18,
      fontWeight: "bold",
   },

   ratingRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginTop: 10,
   },

   badge: {
      backgroundColor: Colors.btnColor,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 20,
      alignSelf: "flex-start",
   },

   badgeText: {
      color: Colors.btnText,
      fontSize: 13,
      fontWeight: "600",
   },

   trailerBtn: {
      marginTop: 14,
      borderWidth: 1,
      borderColor: Colors.btnText,
      backgroundColor: Colors.btnColor,
      borderRadius: 8,
      paddingVertical: 8,
      alignItems: "center",
      width: 140,
   },

   trailerBtnText: {
      color: Colors.text,
      fontWeight: "600",
   },

   modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.85)",
      justifyContent: "center",
   },

   modalContainer: {
      paddingHorizontal: 20,
   },

   closeBtn: {
      position: "absolute",
      top: -40,
      right: 20,
      zIndex: 10,
   },
});
