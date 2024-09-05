import React, { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";
import { Audio } from "expo-av";
import { ActivityIndicator } from "react-native-paper";

export default function AudioPlayerScreen({ route, navigation }) {
  const { audioFile } = route.params;
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSound = async () => {
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: audioFile },
          { shouldPlay: true }
        );
        setSound(newSound);
        setIsPlaying(true);
        newSound.setOnPlaybackStatusUpdate((status) =>
          setIsPlaying(status.isPlaying)
        );
      } catch (error) {
        console.error("Error loading sound:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSound();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [audioFile]);

  const handlePlayPause = async () => {
    if (isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
        Audio Guide
      </Text>
      <Button title={isPlaying ? "Pause" : "Play"} onPress={handlePlayPause} />
    </View>
  );
}
