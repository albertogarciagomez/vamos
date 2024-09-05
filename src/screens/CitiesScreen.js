import React, { useEffect, useState } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
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

export default function CitiesScreen({ route, navigation }) {
  const { countryId } = route.params;
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const getCities = async () => {
      try {
        console.log("Fetching cities for countryId:", countryId);
        // Referencia al documento del país
        const countryDocRef = doc(db, "countries", countryId);
        // Referencia a la subcolección 'cities'
        const citiesCollectionRef = collection(countryDocRef, "cities");

        // Obtener los documentos de la subcolección
        const querySnapshot = await getDocs(citiesCollectionRef);
        const cityList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        console.log("la buena:", cityList); // Verifica que la lista de ciudades se está generando correctamente
        setCities(cityList);
      } catch (error) {
        console.log("Error fetching cities:", error);
      }
    };

    getCities();
  }, [countryId]);

  return (
    <ScrollView>
      {console.log(countryId.name)}
      <View>
        {cities.map((list) => (
          <TouchableOpacity
            key={list.id}
            onPress={() =>
              navigation.navigate("MonumentsScreen", {
                countryId,
                cityId: list.id,
              })
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
