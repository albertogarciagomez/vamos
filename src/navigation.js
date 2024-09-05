import { StatusBar } from "expo-status-bar";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import CitiesScreen from "./screens/CitiesScreen";
import MonumentsScreen from "./screens/MonumentsScreen";
import MonumentDetailScreen from "./screens/MonumentDetailScreen";
import AudioPlayerScreen from "./screens/AudioPlayerScreen";

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ title: "Elige el pais" }}
      />
      <Stack.Screen
        name="CitiesScreen"
        component={CitiesScreen}
        options={{ title: "Elige la ciudad" }}
      />
      <Stack.Screen
        name="MonumentsScreen"
        component={MonumentsScreen}
        options={{ title: "Elige el monumento" }}
      />
      <Stack.Screen
        name="MonumentDetailScreen"
        component={MonumentDetailScreen}
        options={{ title: "Reproduce la guía" }}
      />
      <Stack.Screen
        name="AudioPlayerScreen"
        component={AudioPlayerScreen}
        options={{ title: "Reproduciendo" }}
      />
    </Stack.Navigator>
  );
}
export default function Navigation() {
  return (
    <NavigationContainer>
      <StatusBar />
      <MyStack />
    </NavigationContainer>
  );
}
