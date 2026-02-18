import { Genre } from "@/types/genre";
import React from "react";
import { StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

type Props = {
   genres: Genre[];
   selectedGenre: number | null;
   onSelect: (id: number | null) => void;
};

const GenreDropdown = ({ genres, selectedGenre, onSelect }: Props) => {
   return (
      <Dropdown
         style={{
            height: 48,
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 12,
            borderColor: "#ccc",
         }}
         placeholderStyle={{ color: "#999" }}
         selectedTextStyle={{ color: "#333" }}
         data={genres}
         labelField="name"
         valueField="id"
         placeholder="Select Genre"
         value={selectedGenre}
         onChange={(item) => onSelect(item.id)}
      />
   );
};

export default GenreDropdown;

const styles = StyleSheet.create({});
