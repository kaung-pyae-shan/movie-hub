import { Colors } from "@/constants/Colors";
import { Person } from "@/types/person";
import { getPoster } from "@/util/image";
import { Link } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const POSTER_WIDTH = 100;
const POSTER_HEIGHT = 100;

const ActorProfile = ({
  id,
  name,
  profile_path,
  onPress,
}: Person & { onPress?: () => void }) => {
  const [loading, setLoading] = useState(true);
  return (
    <Link href={`../actors/${id}`} asChild>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.container}>
          <View style={styles.posterWrapper}>
            {(loading || !profile_path) && (
              <Image
                source={require("../assets/images/profile.jpg")}
                style={[styles.poster, { borderRadius: 50 }]}
                resizeMode="cover"
              />
            )}
            {profile_path && (
              <Image
                source={{ uri: getPoster(profile_path) }}
                style={[styles.poster, { borderRadius: 50 }]}
                resizeMode="cover"
                onLoadEnd={() => setLoading(false)}
              />
            )}
          </View>

          <Text style={{ color: Colors.btnText, textAlign: "center" }}>
            {name}
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default ActorProfile;

const styles = StyleSheet.create({
  container: {
    width: 100,
    justifyContent: "center",
    overflow: "hidden",
  },

  posterWrapper: {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
  },

  poster: {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    position: "absolute",
    top: 0,
    left: 0,
  },
});
