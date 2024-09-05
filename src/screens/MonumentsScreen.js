import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { List } from "react-native-paper";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
} from "firebase/firestore";
import appFirebase from "../firebase";

const db = getFirestore(appFirebase);

export default function MonumentsScreen({ route, navigation }) {
  const { countryId, cityId } = route.params;
  const [monuments, setMonuments] = useState([]);

  useEffect(() => {
    const getMonuments = async () => {
      try {
        console.log("Fetching monuments for cityId:", cityId);

        // Referencia al documento de la ciudad
        const cityDocRef = doc(db, "countries", countryId, "cities", cityId);

        // Referencia a la subcolección 'monuments'
        const monumentsCollectionRef = collection(cityDocRef, "monuments");

        // Obtener los documentos de la subcolección
        const querySnapshot = await getDocs(monumentsCollectionRef);
        const monumentsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));

        console.log("Monuments list:", monumentsList);
        setMonuments(monumentsList);
      } catch (error) {
        console.log("Error fetching monuments:", error);
      }
    };

    getMonuments();
  }, [countryId, cityId]);

  return (
    <ScrollView>
      <View>
        {monuments.map((monument) => (
          <View key={monument.id}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("MonumentDetailScreen", {
                  countryId,
                  cityId,
                  monumentId: monument.id,
                })
              }
            >
              <List.Item
                title={monument.name}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
