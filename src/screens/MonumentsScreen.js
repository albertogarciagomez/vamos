import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  Button,
} from "react-native";
import { List } from "react-native-paper";
import { getFirestore, collection, doc, getDocs } from "firebase/firestore";
import appFirebase from "../firebase";
import * as Location from "expo-location"; // Importamos expo-location para obtener la ubicación del usuario

const db = getFirestore(appFirebase);

// Función para calcular la distancia usando la fórmula del Haversine
const haversineDistance = (coords1, coords2) => {
  const toRad = (value) => (value * Math.PI) / 180;

  const R = 6371; // Radio de la Tierra en km
  const dLat = toRad(coords2.latitude - coords1.latitude);
  const dLon = toRad(coords2.longitude - coords1.longitude);
  const lat1 = toRad(coords1.latitude);
  const lat2 = toRad(coords2.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distancia en km
};

export default function MonumentsScreen({ route, navigation }) {
  const { countryId, cityId } = route.params;
  const [monuments, setMonuments] = useState([]);
  const [userLocation, setUserLocation] = useState(null); // Estado para almacenar la ubicación del usuario
  const [locationPermission, setLocationPermission] = useState(true); // Estado para almacenar si los permisos fueron concedidos

  // Función para obtener los permisos de localización
  const requestLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setLocationPermission(false); // Si no se conceden permisos, actualizamos el estado
      return;
    }

    setLocationPermission(true); // Si se conceden permisos, actualizamos el estado
    let location = await Location.getCurrentPositionAsync({});
    setUserLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

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
        let monumentsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          latitude: doc.data().latitude, // Asegúrate de tener latitud y longitud en tus datos de Firebase
          longitude: doc.data().longitude,
        }));

        // Si tenemos la ubicación del usuario, calculamos las distancias
        if (userLocation) {
          monumentsList = monumentsList.map((monument) => ({
            ...monument,
            distance: haversineDistance(userLocation, {
              latitude: monument.latitude,
              longitude: monument.longitude,
            }),
          }));

          // Ordenamos los monumentos por distancia
          monumentsList.sort((a, b) => a.distance - b.distance);
        }

        console.log("Monuments list:", monumentsList);
        setMonuments(monumentsList);
      } catch (error) {
        console.log("Error fetching monuments:", error);
      }
    };

    if (userLocation) {
      getMonuments();
    }
  }, [countryId, cityId, userLocation]); // Asegúrate de que getMonuments se llama cuando userLocation cambia

  return (
    <ScrollView>
      <View>
        {!locationPermission && ( // Si no se tienen permisos, mostrar el banner
          <View style={styles.banner}>
            <Text style={styles.bannerText}>
              Para usar esta aplicación, por favor activa la localización y
              otorga permisos de ubicación.
            </Text>
            <Button
              title="Activar localización"
              onPress={requestLocationPermission} // Vuelve a solicitar los permisos de localización cuando se pulsa el botón
            />
          </View>
        )}

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
                title={`${monument.name} (${
                  monument.distance ? monument.distance.toFixed(2) : "N/A"
                } km)`} // Mostrar distancia si existe
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: "#ffcccb",
    padding: 10,
    marginBottom: 10,
    alignItems: "center", // Centrar el contenido
  },
  bannerText: {
    color: "#ff0000",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 10, // Añadir espacio entre el texto y el botón
  },
});
