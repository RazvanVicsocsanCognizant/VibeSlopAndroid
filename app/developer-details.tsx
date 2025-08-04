import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Developer } from "@/types";
import { useLocalSearchParams, Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";

export default function DeveloperDetailsScreen() {
  const { developer: developerString } = useLocalSearchParams();
  const developer: Developer = JSON.parse(developerString as string);

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: developer.name }} />
      <Image source={{ uri: developer.photo }} style={styles.photo} />
      <View style={styles.infoContainer}>
        <ThemedText type="subtitle">{developer.name}</ThemedText>
        <ThemedText>{developer.location}</ThemedText>
        <ThemedText>Experience: {developer.yearsOfExperience} years</ThemedText>
        <ThemedText>Tech Stack: {developer.techStack.join(", ")}</ThemedText>
        <ThemedText>Project: {developer.project || "N/A"}</ThemedText>
        <ThemedText>Available: {developer.available}</ThemedText>
        <ThemedText type="subtitle" style={styles.summaryTitle}>
          Evaluation Summary
        </ThemedText>
        <ThemedText>{developer.evaluationResult}</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    marginBottom: 16,
  },
  infoContainer: {
    gap: 8,
  },
  summaryTitle: {
    marginTop: 16,
  },
});
