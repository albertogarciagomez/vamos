import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import appFirebase from "../firebase";
import { ActivityIndicator } from "react-native-paper";

const db = getFirestore(appFirebase);

export default function MonumentDetailScreen({ route, navigation }) {
  const { countryId, cityId, monumentId } = route.params;
  const [monument, setMonument] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMonument = async () => {
      try {
        console.log("Fetching monument details for monumentId:", monumentId);

        // Referencia al documento del monumento
        const monumentDocRef = doc(
          db,
          "countries",
          countryId,
          "cities",
          cityId,
          "monuments",
          monumentId
        );

        const monumentDoc = await getDoc(monumentDocRef);

        if (monumentDoc.exists()) {
          setMonument(monumentDoc.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.log("Error fetching monument details:", error);
      } finally {
        setLoading(false);
      }
    };

    getMonument();
  }, [countryId, cityId, monumentId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!monument) {
    return <Text>No monument details found.</Text>;
  }

  return (
    <ScrollView>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
          {monument.name}
        </Text>
        {monument.images && monument.images.length > 0 && (
          <ScrollView horizontal pagingEnabled>
            {monument.images.map((url, index) => (
              <Image
                key={index}
                source={{ uri: url }}
                style={{
                  width: 300,
                  height: 200,
                  marginRight: 10,
                  borderRadius: 10,
                }}
              />
            ))}
          </ScrollView>
        )}
        {monument.googleMapsURL && (
          <TouchableOpacity
            onPress={() => Linking.openURL(monument.googleMapsURL)}
          >
            <Text style={{ color: "blue", marginTop: 16 }}>
              View on Google Maps
            </Text>
          </TouchableOpacity>
        )}
        {monument.audioFile && (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("AudioPlayerScreen", {
                audioFile: monument.audioFile,
              })
            }
          >
            <Text style={{ color: "blue", marginTop: 16 }}>
              Listen Audio Guide
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}
