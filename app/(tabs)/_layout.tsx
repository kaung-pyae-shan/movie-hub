import { Colors } from "@/constants/Colors";
import Feather from "@expo/vector-icons/Feather";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";

export default function TabLayout() {
   return (
      <>
         <StatusBar style="auto" />
         <Tabs
            screenOptions={{
               headerShown: false,
               tabBarActiveTintColor: Colors.activeTab,
               tabBarStyle: { backgroundColor: Colors.background },
            }}
         >
            <Tabs.Screen
               name="index"
               options={{
                  title: "Home",
                  tabBarIcon: ({ color, size }) => (
                     <Feather name="home" size={size} color={color} />
                  ),
               }}
            />
            <Tabs.Screen
               name="movies"
               options={{
                  title: "Movies",
                  tabBarIcon: ({ color, size }) => (
                     <Feather name="video" size={size} color={color} />
                  ),
               }}
            />
            <Tabs.Screen
               name="series"
               options={{
                  title: "Series",
                  tabBarIcon: ({ color, size }) => (
                     <Feather name="film" size={size} color={color} />
                  ),
               }}
            />
            <Tabs.Screen
               name="favorites"
               options={{
                  title: "Favorites",
                  tabBarIcon: ({ color, size }) => (
                     <Feather name="bookmark" size={size} color={color} />
                  ),
               }}
            />
         </Tabs>
      </>
   );
}
