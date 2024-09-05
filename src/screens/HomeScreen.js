import { StatusBar } from "expo-status-bar";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { List } from "react-native-paper";

import appFirebase from "../firebase";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  setDoct,
} from "firebase/firestore";

const db = getFirestore(appFirebase);

export default function HomeScreen(props) {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const getCountries = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "countries"));
        const docs = [];
        querySnapshot.forEach((doc) => {
          const { name, flag } = doc.data();
          docs.push({
            id: doc.id,
            name,
            flag,
          });
        });
        setCountries(docs);
      } catch (error) {
        console.log(error);
      }
    };
    getCountries();
  }, []);

  return (
    <ScrollView>
      <View>
        {countries.map((list) => (
          <TouchableOpacity
            key={list.id}
            onPress={() =>
              props.navigation.navigate("CitiesScreen", { countryId: list.id })
            }
          >
            <List.Item
              title={list.name}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
            />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
