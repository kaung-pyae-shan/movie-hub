import CastGrid from "@/components/CastGrid";
import SeasonList from "@/components/SeasonList";
import { Colors } from "@/constants/Colors";
import useFetch from "@/hooks/useFetch";
import { fetchMoviesCasts, fetchMovieVideos } from "@/services/movieService";
import { fetchSerieCasts, fetchSerieDetails, fetchSerieVideos } from "@/services/serieService";
import { getPoster } from "@/util/image";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
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

export default function SerieDetails() {
   const router = useRouter();
   const { id } = useLocalSearchParams();

   const [showTrailer, setShowTrailer] = useState(false);
   const [playing, setPlaying] = useState(false);

   const { data: videos } = useFetch(() => fetchSerieVideos(id as string));

   const { data: serie, loading } = useFetch(() =>
      fetchSerieDetails(id as string),
   );

   const { data: castsAndCrews } = useFetch(() =>
      fetchSerieCasts(id as string),
   );

   // Get YouTube trailer only
   const trailerKey = useMemo(() => {
      if (!videos?.results) return null;

      const trailer = videos.results.find(
         (v) => v.site === "YouTube" && v.type === "Trailer",
      );

      return trailer?.key ?? null;
   }, [videos]);

   if (loading || !serie)
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
                     uri: getPoster(serie.backdrop_path ?? null),
                  }}
                  style={{ width: "100%", height: 225, borderRadius: 10 }}
                  resizeMode="cover"
               />
               <View
                  style={{
                     width: "100%",
                     paddingTop: 20,
                     alignItems: "center",
                  }}
               >
                  <Text style={styles.title}>
                     {serie.name} ({serie.first_air_date?.split("-")[0]})
                  </Text>
                  <Text style={styles.text}>
                     Episode runtime:{" "}
                     {serie.episode_run_time[0]
                        ? `${serie.episode_run_time[0]} min`
                        : "Not Available"}
                  </Text>
                  <Text style={styles.text}>
                     {serie.genres.map((g) => g.name).join(", ")}
                  </Text>
                  <View style={styles.ratingRow}>
                     <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                           <Entypo name="star" size={14} color="yellow" />{" "}
                           {Math.round(serie.vote_average * 10) / 10}/10
                        </Text>
                     </View>

                     <View style={styles.badge}>
                        <Ionicons
                           name="bookmark-outline"
                           size={18}
                           color={Colors.text}
                        />
                     </View>
                     {/* <View style={styles.badge}>
                        <Ionicons
                           name="bookmark"
                           size={18}
                           color="yellow"
                        />
                     </View> */}
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
                  </View>
               </View>
            </View>

            <View style={styles.serieContentContainer}>
               <View>
                  <Text style={styles.title}>Overview</Text>
                  <Text style={styles.text}>{serie.overview}</Text>
               </View>

               <SeasonList seasons={serie.seasons} />

               {castsAndCrews?.cast?.length ? (
                  <CastGrid title="Casts" casts={castsAndCrews.cast} />
               ) : (
                  <>
                     <Text
                        style={{
                           color: Colors.text,
                           fontSize: 18,
                           fontWeight: "bold",
                        }}
                     >
                        Casts
                     </Text>
                     <Text style={{ color: Colors.text }}>
                        No casts information available.
                     </Text>
                  </>
               )}

               {castsAndCrews?.crew?.length ? (
                  <CastGrid title="Crews" casts={castsAndCrews.crew} />
               ) : (
                  <>
                     <Text
                        style={{
                           color: Colors.text,
                           fontSize: 18,
                           fontWeight: "bold",
                        }}
                     >
                        Crews
                     </Text>
                     <Text style={{ color: Colors.text }}>
                        No crews information available.
                     </Text>
                  </>
               )}
            </View>
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
      // paddingHorizontal: 20,
   },

   movieHeader: {
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
      justifyContent: "center",
      gap: 12,
      marginTop: 10,
   },

   badge: {
      backgroundColor: Colors.btnColor,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 20,
   },

   badgeText: {
      color: Colors.btnText,
      fontSize: 13,
      fontWeight: "600",
   },

   trailerBtn: {
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

   serieContentContainer: {
      paddingHorizontal: 20,
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
