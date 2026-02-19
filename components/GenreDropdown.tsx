import { Colors } from "@/constants/Colors";
import { Genre } from "@/types/genre";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

type Props = {
  title: string;
  genres: Genre[];
  selectedGenre: number | null;
  onSelect: (id: number | null) => void;
};

const GenreDropdown = ({ title, genres, selectedGenre, onSelect }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Dropdown
        style={styles.dropdown}
        containerStyle={styles.dropdownContainer}
        itemContainerStyle={styles.itemContainer}
        itemTextStyle={styles.itemText}
        selectedTextStyle={styles.selectedText}
        activeColor="#0a9396"
        data={genres}
        labelField="name"
        valueField="id"
        value={selectedGenre}
        onChange={(item) => onSelect(item.id)}
      />
    </View>
  );
};

export default GenreDropdown;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "light",
    color: Colors.title,
  },
  dropdown: {
    width: "45%",
    height: 48,
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: "#001219",
    borderWidth: 1,
    borderColor: "#0a9396",
  },
  dropdownContainer: {
    borderRadius: 10,
    borderColor: "#0a9396",
  },
  selectedText: {
    color: "#e9d8a6",
    fontSize: 14,
    fontWeight: "500",
  },
  itemContainer: {
    backgroundColor: "#001219",
    borderBottomWidth: 0.5,
    borderBottomColor: "#0a9396",
  },
  itemText: {
    color: "#e9d8a6",
    fontSize: 14,
  },
});
